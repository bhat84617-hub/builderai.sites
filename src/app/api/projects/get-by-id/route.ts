import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ project: null })

  await connectDB()
  const user = await User.findOne({ "projects._id": id }, { "projects.$": 1 }).lean()
  const project = user?.projects?.[0] || null
  return NextResponse.json({ project })
}
