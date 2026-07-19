"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { PROVIDERS, getProvider } from "@/lib/llm"
import { Check, ExternalLink, Key, Save, Trash2, Zap, Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const { user } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [providerId, setProviderId] = useState("openrouter")
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [modelId, setModelId] = useState("")
  const [saved, setSaved] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user || user.email !== "bhat84617@gmail.com") { router.push("/dashboard"); return }
    loadConfig()
  }, [user, router])

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/admin/llm-config")
      const data = await res.json()
      if (data.config) {
        setProviderId(data.config.providerId || "openrouter")
        setApiKey(data.config.apiKey || "")
        setBaseUrl(data.config.baseUrl || "")
        setModelId(data.config.modelId || "")
        setHasConfig(true)
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const provider = getProvider(providerId)

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/llm-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          apiKey,
          modelId: modelId || provider?.models[0]?.id || "",
          baseUrl: baseUrl || undefined,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setHasConfig(true)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { setError("Failed to save") } finally { setSaving(false) }
  }

  const handleClear = async () => {
    setSaving(true)
    try {
      await fetch("/api/admin/llm-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      })
      setApiKey(""); setBaseUrl(""); setModelId(""); setProviderId("openrouter"); setHasConfig(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {} finally { setSaving(false) }
  }

  if (!user || user.email !== "bhat84617@gmail.com") return null
  if (loading) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-replit-text">AI Settings</h1>
        <p className="text-replit-muted mt-1">Configure your LLM provider for site generation</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-replit-red/30 bg-replit-red/5 px-4 py-3 text-sm text-replit-red">{error}</div>}

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-replit-accent" /> Choose Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-replit-text mb-1.5 block">Provider</label>
              <Select value={providerId} onChange={(e) => { setProviderId(e.target.value); setModelId(""); setBaseUrl("") }}>
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>

            {provider && (
              <div>
                <label className="text-sm font-medium text-replit-text mb-1.5 block">{provider.apiKeyLabel}</label>
                <div className="flex gap-2">
                  <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={provider.apiKeyPlaceholder} className="flex-1" />
                  {provider.docsUrl && <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer"><Button variant="secondary" size="sm" type="button"><ExternalLink className="h-4 w-4" /></Button></a>}
                </div>
              </div>
            )}

            {providerId === "openai-compatible" && (
              <div>
                <label className="text-sm font-medium text-replit-text mb-1.5 block">Base URL</label>
                <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com/v1/chat/completions" />
              </div>
            )}

            {provider && provider.models.length > 0 && (
              <div>
                <label className="text-sm font-medium text-replit-text mb-1.5 block">Model</label>
                <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
                  {provider.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} {m.free ? "(Free)" : ""}</option>
                  ))}
                </Select>
              </div>
            )}

            {apiKey && (
              <div className="flex items-center gap-2 rounded-lg bg-replit-green/5 border border-replit-green/20 px-3 py-2">
                <Key className="h-4 w-4 text-replit-green shrink-0" />
                <span className="text-xs text-replit-muted">Key saved on server: <strong>{apiKey.slice(0, 8)}...</strong></span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saved && <span className="flex items-center gap-1 text-sm text-replit-green animate-fade-in"><Check className="h-4 w-4" /> Saved!</span>}
          </div>
          <div className="flex gap-2">
            {hasConfig && (
              <Button variant="destructive" size="sm" onClick={handleClear} disabled={saving}>
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
            <Button onClick={handleSave} disabled={!apiKey || !providerId || saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-1" /> Save Configuration</>}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm text-replit-text mb-2">Free Provider Guide</h3>
            <div className="space-y-2 text-sm text-replit-muted">
              <p><strong className="text-replit-text">OpenRouter</strong> — Sign up at openrouter.ai, get free credits. Multiple free models available.</p>
              <p><strong className="text-replit-text">Nvidia NIM</strong> — Free API access at build.nvidia.com. No credit card needed.</p>
              <p><strong className="text-replit-text">HuggingFace</strong> — Free token at huggingface.co/settings/tokens. Set <code className="bg-replit-hover px-1 rounded">HF_TOKEN</code> in .env.local.</p>
              <div className="mt-3 flex gap-4">
                <Badge variant="success" className="flex items-center gap-1"><Zap className="h-3 w-3" /> No API key? Template fallback works automatically</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
