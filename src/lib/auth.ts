import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/postgres";
import User from "@/models/User";
import { checkRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { sendTemplateEmail } from "@/lib/email";
import { after } from "next/server";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import bcrypt from "bcryptjs";

// 🛡️ Anti-Enumeration: every credentials failure before a correct password is proven
// (no account, social-login account, locked account, wrong password) throws this same
// error, so the login form can't be used to find out who has an account.
const INVALID_CREDENTIALS = "InvalidCredentials";

const LOCKOUT_MINUTES = 15;
const MAX_FAILED_ATTEMPTS = 5;

// Compared against when there is no real hash, so a missing account costs the same
// bcrypt time as an existing one. Built once, on first use.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("dotsuite-timing-equalizer", 10));

// Sends after the response when a request scope exists; falls back to a detached send
// Language the visitor was browsing in (next-intl's cookie), stored on new OAuth users
// so their emails match it. Undefined when unknown; emails then use the default locale.
const getBrowsingLocale = async (): Promise<string | undefined> => {
  try {
    const value = (await cookies()).get("NEXT_LOCALE")?.value;
    return value && (routing.locales as readonly string[]).includes(value) ? value : undefined;
  } catch {
    return undefined;
  }
};

const sendAfterResponse = (task: () => Promise<unknown>) => {
  try {
    after(task);
  } catch {
    void task();
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        // Extract IP and user agent for audit logs
        const forwardedFor = req.headers?.["x-forwarded-for"];
        const realIp = req.headers?.["x-real-ip"];
        const rawIp = forwardedFor || realIp || "unknown";
        const ip = Array.isArray(rawIp) 
          ? rawIp[0].split(',')[0].trim() 
          : rawIp.split(',')[0].trim();
        const userAgent = req.headers?.["user-agent"] || "Unknown Device";

        // 1. Advanced Rate Limiting (IP + Email combined)
        const rateLimitIdentifier = `${ip}_${credentials.email}`;
        const rateLimit = await checkRateLimit(rateLimitIdentifier, "login", 5, 3600);
        
        if (!rateLimit.success) {
          throw new Error(`Too many login attempts. Please try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.`);
        }

        await connectDB();

        // 2. Fetch user and check the password before revealing anything about the account
        const user = await User.findOne({ email: credentials.email }).select("+password");
        const isValid = user?.password
          ? await user.comparePassword(credentials.password)
          : (await bcrypt.compare(credentials.password, await getDummyHash()), false);

        const audit = (details: string) =>
          logAudit({
            userId: user?._id.toString(),
            email: user?.email ?? credentials.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details,
          });

        if (!user) {
          await audit("User not found");
          throw new Error(INVALID_CREDENTIALS);
        }

        if (!user.password) {
          await audit("OAuth user attempted credentials login");
          throw new Error(INVALID_CREDENTIALS);
        }

        // 3. Locked accounts get the generic error too; the owner was told by email
        if (user.isLockedOut()) {
          await audit(`Account locked for ${user.getLockoutTimeRemaining()} minutes`);
          throw new Error(INVALID_CREDENTIALS);
        }

        if (!isValid) {
          user.failedLoginAttempts += 1;

          if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            user.lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
            await user.save();
            await audit(`Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts`);

            // 📧 Tell the owner, since the login form no longer says the account is locked
            sendAfterResponse(() =>
              sendTemplateEmail({
                to: user.email,
                kind: "accountLocked",
                locale: user.locale,
                data: { lockoutMinutes: LOCKOUT_MINUTES },
              })
            );
          } else {
            await user.save();
            await audit("Invalid password");
          }

          throw new Error(INVALID_CREDENTIALS);
        }

        // 4. The password is correct, so it's safe to say the email still needs verifying
        if (!user.isEmailVerified) {
          await audit("Email not verified");
          throw new Error("EmailNotVerified");
        }

        // Reset failed attempts on successful login
        if (user.failedLoginAttempts > 0) {
          await user.resetLoginAttempts();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          sessionVersion: user.sessionVersion ?? 1,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        const existing = await User.findOne({ email: user.email });
        const isOAuth = account?.provider !== "credentials";

        if (!existing) {
          // oauth user creates a new user in our database on first login
          const newUser = await User.create({
            email: user.email || "",
            name: user.name || "No Name",
            image: user.image || "",
            isEmailVerified: true,
            locale: await getBrowsingLocale(),
          });

          // 📝 Log new user registration via OAuth
          await logAudit({
            userId: newUser._id.toString(),
            email: newUser.email,
            action: "REGISTER",
            status: "SUCCESS",
            details: `New account created via ${account?.provider || "oauth"}`,
          });

          // 📝 Log OAuth login success
          if (isOAuth) {
            await logAudit({
              userId: newUser._id.toString(),
              email: newUser.email,
              action: "LOGIN",
              status: "SUCCESS",
              details: `First login via ${account?.provider}`,
            });
          }
        } else {
          // update user details if they have changed
          if (isOAuth && user.image && user.image !== existing.image) {
            await User.findOneAndUpdate(
              { email: user.email },
              { image: user.image! },
            );
          }

          // 📝 Log login success (OAuth or Credentials)
          await logAudit({
            userId: existing._id.toString(),
            email: existing.email,
            action: "LOGIN",
            status: "SUCCESS",
            details: isOAuth ? `Login via ${account?.provider}` : "Login via credentials",
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        if (token.image) session.user.image = token.image as string;
        if (token.name) session.user.name = token.name as string;

        // 🛡️ Session Version Validation: Invalidate JWTs after password change/reset.
        // If sessionVersion in the token doesn't match the DB, the user must re-login.
        if (token.sub) {
          try {
            await connectDB();
            const dbUser = await User.findById(token.sub).select("sessionVersion");
            if (!dbUser || dbUser.sessionVersion !== token.sessionVersion) {
              // Returning null triggers NextAuth to clear the session
              return null as unknown as typeof session;
            }
          } catch {
            // A database outage must not bypass account/session revocation.
            return null as unknown as typeof session;
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
        token.image = user.image;
        token.name = user.name;
        // Store sessionVersion in token so we can validate it later
        token.sessionVersion = (user as { sessionVersion?: number }).sessionVersion ?? 1;

        // For OAuth, user.id is the provider ID (e.g. GitHub ID). 
        // We MUST fetch the MongoDB _id so the Rust backend can parse it as an ObjectId.
        if (account && account.provider !== "credentials") {
          try {
            await connectDB();
            const dbUser = await User.findOne({ email: user.email });
            if (dbUser) {
              token.sub = dbUser._id.toString();
              token.id = dbUser._id.toString();
              token.sessionVersion = dbUser.sessionVersion ?? 1;
            }
          } catch (e) {
            console.error("Error fetching db user in jwt callback", e);
          }
        }
      }

      if (trigger === "update" && session?.user) {
        if (session.user.image) token.image = session.user.image;
        if (session.user.name) token.name = session.user.name;
      }

      return token;
    },
  },
  events: {
    async signOut({ token }) {
      // 📝 Log logout event
      if (token?.sub) {
        await logAudit({
          userId: token.sub,
          action: "LOGOUT",
          status: "SUCCESS",
          details: "User signed out",
        });
      }
    },
  },
};
