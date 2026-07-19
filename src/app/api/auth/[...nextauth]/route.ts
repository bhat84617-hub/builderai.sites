import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth"

const isMongoAvailable = process.env.MONGODB_URI && process.env.MONGODB_URI !== "mongodb://placeholder"

let options = { ...authOptions }

if (isMongoAvailable) {
  try {
    const getClientPromise = (await import("@/lib/mongo-client")).default
    const { MongoDBAdapter } = await import("@auth/mongodb-adapter")
    options = { ...options, adapter: MongoDBAdapter(getClientPromise()) }
  } catch {}
}

const handler = NextAuth(options)
export { handler as GET, handler as POST }
