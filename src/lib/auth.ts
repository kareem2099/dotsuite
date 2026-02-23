import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit } from "@/lib/rateLimit";

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

        // 1. Advanced Rate Limiting (IP + Email combined)
        const forwardedFor = req.headers?.["x-forwarded-for"];
        const realIp = req.headers?.["x-real-ip"];
        const rawIp = forwardedFor || realIp || "unknown";
        const ip = Array.isArray(rawIp) 
          ? rawIp[0].split(',')[0].trim() 
          : rawIp.split(',')[0].trim();
        
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
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This email is registered with Google or GitHub. Please sign in with that provider.");
        }

        if (!user.isEmailVerified) {
          throw new Error("EmailNotVerified");
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Invalid password");
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
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          // oauth user creates a new user in our database on first login
          await User.create({
            email: user.email || "",
            name: user.name || "No Name",
            image: user.image || "",
            isEmailVerified: true,
          });
        } else {
          // update user details if they have changed
          if (account?.provider !== "credentials" && user.image && user.image !== existing.image) {
            await User.findOneAndUpdate(
              { email: user.email },
              { image: user.image! },
            );
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};
