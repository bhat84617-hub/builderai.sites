export interface LLMModel {
  id: string
  name: string
  provider: string
  free: boolean
}

export interface LLMProvider {
  id: string
  name: string
  baseUrl: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  docsUrl: string
  models: LLMModel[]
  formatBody: (systemPrompt: string, userPrompt: string, model: string) => Record<string, unknown>
  parseResponse: (raw: unknown) => string
  headers?: (apiKey: string) => Record<string, string>
}

export const PROVIDERS: LLMProvider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKeyLabel: "OpenRouter API Key",
    apiKeyPlaceholder: "sk-or-v1-...",
    docsUrl: "https://openrouter.ai/keys",
    models: [
      { id: "openrouter/auto", name: "Auto (Best for prompt)", provider: "openrouter", free: false },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", provider: "openrouter", free: true },
      { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)", provider: "openrouter", free: true },
      { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)", provider: "openrouter", free: true },
      { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B (Free)", provider: "openrouter", free: true },
      { id: "google/gemini-flash-1.5-8b:free", name: "Gemini Flash 1.5 8B (Free)", provider: "openrouter", free: true },
      { id: "microsoft/phi-3-mini-128k-instruct:free", name: "Phi-3 Mini (Free)", provider: "openrouter", free: true },
      { id: "cognitivecomputations/dolphin-llama-3-8b-lex-unleashed:free", name: "Dolphin Llama 3 8B (Free)", provider: "openrouter", free: true },
      { id: "sophosympatheia/rogue-rose-103b-v0.2:free", name: "Rogue Rose 103B (Free)", provider: "openrouter", free: true },
      { id: "__custom__", name: "Custom Model (type any ID)", provider: "openrouter", free: true },
    ],
    formatBody: (system, user, model) => ({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
    parseResponse: (raw: unknown) => {
      const r = raw as { choices?: { message?: { content?: string } }[] }
      return r?.choices?.[0]?.message?.content || ""
    },
  },
  {
    id: "anthropic",
    name: "Claude (Anthropic)",
    baseUrl: "https://api.anthropic.com/v1/messages",
    apiKeyLabel: "Claude API Key",
    apiKeyPlaceholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/",
    models: [
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", provider: "anthropic", free: false },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", provider: "anthropic", free: false },
    ],
    headers: (key) => ({
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    }),
    formatBody: (system, user, model) => ({
      model,
      system,
      messages: [{ role: "user", content: user }],
      max_tokens: 2048,
    }),
    parseResponse: (raw: unknown) => {
      const r = raw as { content?: { text?: string }[] }
      return r?.content?.[0]?.text || ""
    },
  },
  {
    id: "nvidia",
    name: "Nvidia NIM",
    baseUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    apiKeyLabel: "Nvidia API Key",
    apiKeyPlaceholder: "nvapi-...",
    docsUrl: "https://build.nvidia.com/",
    models: [
      { id: "meta/llama-3.2-3b-instruct", name: "Llama 3.2 3B (Free)", provider: "nvidia", free: true },
      { id: "mistralai/mistral-7b-instruct-v0.3", name: "Mistral 7B (Free)", provider: "nvidia", free: true },
    ],
    formatBody: (system, user, model) => ({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
    parseResponse: (raw: unknown) => {
      const r = raw as { choices?: { message?: { content?: string } }[] }
      return r?.choices?.[0]?.message?.content || ""
    },
  },
  {
    id: "openai-compatible",
    name: "OpenAI Compatible",
    baseUrl: "", // user provides
    apiKeyLabel: "API Key",
    apiKeyPlaceholder: "sk-...",
    docsUrl: "",
    models: [
      { id: "custom", name: "Custom Model", provider: "openai-compatible", free: true },
    ],
    formatBody: (system, user, model) => ({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
    parseResponse: (raw: unknown) => {
      const r = raw as { choices?: { message?: { content?: string } }[] }
      return r?.choices?.[0]?.message?.content || ""
    },
  },
]

export interface LLMConfig {
  providerId: string
  apiKey: string
  modelId: string
  baseUrl?: string
}

export function getProvider(id: string): LLMProvider | undefined {
  return PROVIDERS.find((p) => p.id === id)
}

export async function callLLM(config: LLMConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  const provider = getProvider(config.providerId)
  if (!provider) throw new Error(`Unknown provider: ${config.providerId}`)

  const baseUrl = config.baseUrl || provider.baseUrl
  const body = provider.formatBody(systemPrompt, userPrompt, config.modelId)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(provider.headers ? provider.headers(config.apiKey) : { "Authorization": `Bearer ${config.apiKey}` }),
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText)
      throw new Error(`LLM API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    const content = provider.parseResponse(data)
    if (!content) throw new Error("Empty response from LLM")
    return content
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}
