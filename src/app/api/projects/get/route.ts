import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ projects: [] })
  }

  await connectDB()
  const user = await User.findOne({ email: session.user.email })
  return NextResponse.json({ projects: user?.projects || [] })
}
