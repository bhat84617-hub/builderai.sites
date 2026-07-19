import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.email !== "bhat84617@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  await connectDB()
  const users = await User.find().sort({ joinedAt: -1 }).lean()
  return NextResponse.json({ users })
}
