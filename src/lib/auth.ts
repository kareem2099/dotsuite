import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { checkRateLimit } from "@/lib/rateLimit";

// 📝 Helper to create audit log (fire and forget)
async function logAudit(
  data: {
    userId?: string;
    email?: string;
    action: string;
    status: "SUCCESS" | "FAILED";
    ip?: string;
    userAgent?: string;
    details?: string;
  }
) {
  try {
    await AuditLog.create(data);
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}

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

        // 2. Fetch user
        const user = await User.findOne({ email: credentials.email }).select("+password");

        // 3. Smart error handling for better UX
        if (!user) {
          // 📝 Log failed login (user not found)
          await logAudit({
            email: credentials.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details: "User not found",
          });
          throw new Error("No user found with this email");
        }

        // 3a. Check account lockout
        if (user.isLockedOut()) {
          // 📝 Log failed login (account locked)
          await logAudit({
            userId: user._id.toString(),
            email: user.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details: `Account locked for ${user.getLockoutTimeRemaining()} minutes`,
          });
          throw new Error(`Account locked. Please try again in ${user.getLockoutTimeRemaining()} minutes.`);
        }

        if (!user.password) {
          // 📝 Log failed login (OAuth user trying credentials)
          await logAudit({
            userId: user._id.toString(),
            email: user.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details: "OAuth user attempted credentials login",
          });
          throw new Error("This email is registered with Google or GitHub. Please sign in with that provider.");
        }

        if (!user.isEmailVerified) {
          // 📝 Log failed login (email not verified)
          await logAudit({
            userId: user._id.toString(),
            email: user.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details: "Email not verified",
          });
          throw new Error("EmailNotVerified");
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          // Increment failed login attempts
          user.failedLoginAttempts += 1;
          
          // Lock account after 5 failed attempts (15 minutes lockout)
          if (user.failedLoginAttempts >= 5) {
            user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
            await user.save();
            
            // 📝 Log account lockout
            await logAudit({
              userId: user._id.toString(),
              email: user.email,
              action: "LOGIN_FAILED",
              status: "FAILED",
              ip,
              userAgent,
              details: "Account locked after 5 failed attempts",
            });
            
            throw new Error(`Too many failed attempts. Account locked for 15 minutes.`);
          }
          
          await user.save();
          
          // 📝 Log failed login (wrong password)
          await logAudit({
            userId: user._id.toString(),
            email: user.email,
            action: "LOGIN_FAILED",
            status: "FAILED",
            ip,
            userAgent,
            details: "Invalid password",
          });
          
          throw new Error("Invalid password");
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
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
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
