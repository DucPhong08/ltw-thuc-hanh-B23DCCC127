import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

import { getUserByEmail } from "@/lib/data";
import { loginSchema } from "@/lib/validation";
import type { Role } from "@/types";

const providers: Provider[] = [
  Credentials({
    name: "Email & Mật khẩu PTIT",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(raw) {
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) return null;

      const user = await getUserByEmail(parsed.data.email);
      if (!user) return null;

      const isValid = await bcrypt.compare(
        parsed.data.password,
        user.passwordHash,
      );
      if (!isValid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
  // Điểm cộng: GitHub OAuth provider
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID || "dummy-github-id",
    clientSecret: process.env.AUTH_GITHUB_SECRET || "dummy-github-secret",
    profile(profile) {
      return {
        id: String(profile.id),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
        role: "user" as Role,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role as Role) || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      session.user.role = (token.role as Role) || "guest";
      return session;
    },
  },
});
