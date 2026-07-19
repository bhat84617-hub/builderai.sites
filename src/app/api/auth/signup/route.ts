import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      password: hashed,
      plan: "FREE",
      projects: [],
      joinedAt: new Date(),
      provider: "credentials",
    })

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed" },
      { status: 500 }
    )
  }
}
