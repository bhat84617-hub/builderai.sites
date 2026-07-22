"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { ArrowRight, Sparkles, Image as ImageIcon, Layout, Palette, Code2, Check, Loader2 } from "lucide-react"

const suggestions = [
  "A modern landing page for a startup",
  "A creative portfolio for a designer",
  "A landing page for a mobile app",
  "A business landing page with contact form",
  "An e-book sales page",
]

function GenerateContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptFromUrl = searchParams.get("prompt") || ""

  const [phase, setPhase] = useState<"input" | "generating" | "complete">("input")
  const [prompt, setPrompt] = useState(promptFromUrl)
  const [progress, setProgress] = useState(0)
  const [genError, setGenError] = useState("")
  const [lastGenId, setLastGenId] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (promptFromUrl) setPrompt(promptFromUrl)
  }, [promptFromUrl])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setPhase("generating")
    setProgress(0)
    setGenError("")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90 }
        return prev + Math.floor(Math.random() * 8) + 2
      })
    }, 800)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "LANDING_PAGE" }),
      })
      const data = await res.json()
      clearInterval(interval)

      if (data.error) {
        setGenError(data.error)
        setPhase("input")
        return
      }

      // Save to MongoDB
      const saveRes = await fetch("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.project?.name || prompt.slice(0, 40),
          type: "LANDING_PAGE",
          prompt,
          sections: data.pages?.[0]?.sections || [],
          theme: data.project?.theme || {},
        }),
      })
      const saved = await saveRes.json()
      const projectId = saved?.project?._id || `gen-${Date.now()}`

      setProgress(100)
      setLastGenId(projectId)
      setTimeout(() => setPhase("complete"), 500)
    } catch {
      clearInterval(interval)
      setGenError("Generation failed. Check your API key.")
      setPhase("input")
    }
  }

  const handleView = () => {
    router.push(`/preview?id=${lastGenId || `gen-${Date.now()}`}`)
  }

  if (status === "loading") return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>
  if (!session?.user) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {phase === "input" && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-replit-text mb-2">Create a new site</h1>
            <p className="text-replit-muted">Describe what you want and AI will build it for you</p>
          </div>

          {genError && (
            <div className="mb-4 rounded-xl border border-replit-red/30 bg-replit-red/5 px-4 py-3 text-sm text-replit-red">{genError}</div>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-replit-accent/10">
                  <Sparkles className="h-4 w-4 text-replit-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-replit-text">Describe your site</h2>
                  <p className="text-xs text-replit-muted">Be specific for best results</p>
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A modern landing page for a fitness app with hero, features, testimonials, pricing and CTA sections..."
                className="min-h-[120px] w-full rounded-lg border border-replit-border bg-white p-4 text-sm text-replit-text placeholder:text-replit-muted focus:outline-none focus:ring-2 focus:ring-replit-accent resize-none"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setPrompt(s)} className="rounded-full border border-replit-border bg-white px-3 py-1 text-xs text-replit-muted hover:text-replit-text hover:border-replit-accent transition-colors">
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-replit-border pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Free Plan</Badge>
                  <span className="text-xs text-replit-muted">3 sites remaining</span>
                </div>
                <Button onClick={handleGenerate} disabled={!prompt.trim()} className="bg-replit-accent hover:bg-replit-accent-hover text-white">
                  <Sparkles className="h-4 w-4 mr-1.5" /> Generate Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {phase === "generating" && (
        <div className="text-center animate-fade-in py-12">
          <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-replit-accent/10">
            <Loader2 className="h-8 w-8 text-replit-accent animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-replit-text mb-2">Building your site...</h2>
          <p className="text-replit-muted mb-8">Generating sections, copy, and styles</p>
          <div className="mx-auto max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-replit-muted">Progress</span>
              <span className="text-replit-text font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-replit-border">
              <div className="h-full rounded-full bg-gradient-to-r from-replit-accent to-replit-blue transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-replit-muted">
              <span className="flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" /> Layout</span>
              <span className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Styling</span>
              <span className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Content</span>
            </div>
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className="text-center animate-scale-in py-12">
          <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-replit-green/10">
            <Check className="h-8 w-8 text-replit-green" />
          </div>
          <h2 className="text-xl font-bold text-replit-text mb-2">Your site is ready!</h2>
          <p className="text-replit-muted mb-8">Preview or create another</p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleView} size="xl" className="bg-replit-accent hover:bg-replit-accent-hover text-white">
              <Code2 className="h-4 w-4 mr-1.5" /> View Site
            </Button>
            <Button onClick={() => { setPhase("input"); setPrompt(""); setProgress(0); setGenError("") }} size="xl" variant="secondary">
              Create Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>}>
      <GenerateContent />
    </Suspense>
  )
}




