import { connectDB } from "./db"
import { LLMConfig } from "./models"
import type { LLMConfig as LLMConfigType } from "./llm"

export async function readLLMConfig(): Promise<LLMConfigType | null> {
  try {
    await connectDB()
    const doc = await LLMConfig.findOne()
    if (!doc) return null
    return { providerId: doc.providerId, apiKey: doc.apiKey, modelId: doc.modelId, baseUrl: doc.baseUrl }
  } catch { return null }
}

export async function writeLLMConfig(config: LLMConfigType): Promise<void> {
  await connectDB()
  await LLMConfig.deleteMany()
  await LLMConfig.create(config)
}

export async function clearLLMConfig(): Promise<void> {
  await connectDB()
  await LLMConfig.deleteMany()
}
