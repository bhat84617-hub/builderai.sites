import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function GET() {
  await connectDB()
  const users = await User.find().sort({ joinedAt: -1 }).lean()
  return NextResponse.json({ users })
}
