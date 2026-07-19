import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import getClientPromise from "@/lib/mongo-client"

const authOptions: any = {
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
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
    async jwt({ token, user }: any) { if (user) token.id = user.id; return token },
    async session({ session, token }: any) { if (session.user && token.id) session.user.id = token.id; return session },
  },
}

if (process.env.MONGODB_URI) {
  authOptions.adapter = MongoDBAdapter(getClientPromise())
}

const handler = NextAuth(authOptions)
export const GET = handler
export const POST = handler
