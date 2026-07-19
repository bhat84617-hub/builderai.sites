import type { AuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export const authOptions: AuthOptions = {
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })] : []),
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        await connectDB()
        const user = await User.findOne({ email: credentials.email as string })
        if (!user || !user.password) return null
        const match = await bcrypt.compare(credentials.password as string, user.password)
        if (!match) return null
        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && (token as any).id) (session.user as any).id = (token as any).id
      return session
    },
  },
}
