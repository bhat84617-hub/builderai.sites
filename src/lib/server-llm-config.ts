import fs from "fs"
import path from "path"
import type { LLMConfig } from "./llm"

const CONFIG_PATH = path.join(process.cwd(), "llm-config.json")

export function readLLMConfig(): LLMConfig | null {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8")
      return JSON.parse(data)
    }
  } catch {
    // ignore
  }
  return null
}

export function writeLLMConfig(config: LLMConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
}

export function clearLLMConfig(): void {
  try {
    if (fs.existsSync(CONFIG_PATH)) fs.unlinkSync(CONFIG_PATH)
  } catch {
    // ignore
  }
}
