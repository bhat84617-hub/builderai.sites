import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/getSession"
import { readLLMConfig, writeLLMConfig, clearLLMConfig } from "@/lib/server-llm-config"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.email !== "bhat84617@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  const config = await readLLMConfig()
  return NextResponse.json({ config })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.email !== "bhat84617@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  try {
    const { providerId, apiKey, modelId, baseUrl, action } = await req.json()
    if (action === "clear") { await clearLLMConfig(); return NextResponse.json({ success: true }) }
    if (!providerId || !apiKey || !modelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    await writeLLMConfig({ providerId, apiKey, modelId, baseUrl: baseUrl || undefined })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save config" },
      { status: 500 }
    )
  }
}
