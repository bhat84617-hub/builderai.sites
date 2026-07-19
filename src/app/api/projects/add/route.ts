import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { name, type, prompt } = await req.json()
  await connectDB()

  const project = {
    name: name || prompt.slice(0, 40),
    type: type || "LANDING_PAGE",
    prompt,
    status: "READY",
    userId: session.user.id,
    createdAt: new Date(),
  }

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $push: { projects: project } },
    { new: true }
  )

  const saved = user?.projects?.[user.projects.length - 1]
  return NextResponse.json({
    project: { ...project, _id: saved?._id?.toString() },
  })
}
