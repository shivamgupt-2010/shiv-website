import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const email = (credentials.email as string).trim().toLowerCase();
          const password = (credentials.password as string).trim();

          const user = await db.user.findFirst({
            where: {
              email: {
                equals: email,
                mode: 'insensitive',
              }
            }
          });

          if (!user) {
            console.log(`[AUTH] No user found for email: ${email}`);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(`[AUTH] Password mismatch for email: ${email}`);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: (user.role || 'ADMIN').toUpperCase(),
          };
        } catch (error: any) {
          console.error('[AUTH ERROR]:', error);
          const msg = error?.message?.split('\n')?.[0] || 'Database connection failed';
          throw new Error(`DB Error: ${msg}`);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = ((user as any).role || 'ADMIN').toUpperCase();
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token.role || 'ADMIN').toString().toUpperCase();
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "shiv_commerce_secret_fallback_key_2026_xyz",
};
