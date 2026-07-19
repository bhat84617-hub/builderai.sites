import { NextResponse } from "next/server"
import { readLLMConfig, writeLLMConfig, clearLLMConfig } from "@/lib/server-llm-config"

export async function GET() {
  const config = readLLMConfig()
  return NextResponse.json({ config })
}

export async function POST(req: Request) {
  try {
    const { providerId, apiKey, modelId, baseUrl, action } = await req.json()

    if (action === "clear") {
      clearLLMConfig()
      return NextResponse.json({ success: true })
    }

    if (!providerId || !apiKey || !modelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    writeLLMConfig({ providerId, apiKey, modelId, baseUrl: baseUrl || undefined })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save config" },
      { status: 500 }
    )
  }
}
