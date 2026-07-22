"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Monitor, Smartphone, Tablet, Download, Share2, Eye, Code2, Loader2, Check, Copy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Section { type: string; props: Record<string, any> }
interface PreviewProject { _id?: string; name: string; type: string; prompt: string; status: string; sections?: Section[]; theme?: any }

function SectionRenderer({ section }: { section: Section }) {
  const { type, props } = section
  switch (type) {
    case "Hero":
      return (
        <div className="text-center py-12 sm:py-20 px-4 sm:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{props.headline || "Welcome"}</h1>
          <p className="text-base sm:text-lg opacity-70 max-w-xl mx-auto mb-8 leading-relaxed">{props.subheadline || ""}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#8b5cf6] text-white font-semibold text-sm hover:opacity-90 transition-all">{props.ctaPrimary || "Get Started"}</button>
            {props.ctaSecondary && <button className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 font-semibold text-sm hover:bg-gray-50 transition-all">{props.ctaSecondary}</button>}
          </div>
        </div>
      )
    case "Features":
      return (
        <div className="py-10 sm:py-16 px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">What We Offer</h2>
            <p className="text-sm sm:text-base opacity-60">Everything you need in one place</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(props.items || []).map((item: any, i: number) => (
              <div key={i} className="p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center mb-4">
                  <span className="text-lg">✨</span>
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case "Pricing":
      return (
        <div className="py-10 sm:py-16 px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Pricing Plans</h2>
            <p className="text-sm sm:text-base opacity-60">Choose the plan that works for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(props.plans || []).map((plan: any, i: number) => (
              <div key={i} className={`p-6 rounded-xl border-2 ${i === 1 ? "border-[#8b5cf6] shadow-lg scale-[1.02]" : "border-gray-200"}`}>
                {i === 1 && <Badge className="mb-3 bg-[#8b5cf6] text-white">Popular</Badge>}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {(plan.features || []).map((f: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${i === 1 ? "bg-[#8b5cf6] text-white hover:opacity-90" : "border border-gray-300 hover:bg-gray-50"}`}>
                  {plan.cta || "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    case "Testimonials":
      return (
        <div className="py-10 sm:py-16 px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(props.items || []).map((item: any, i: number) => (
              <div key={i} className="p-5 sm:p-6 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm leading-relaxed mb-4 italic">"{item.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-sm font-bold text-[#8b5cf6]">{(item.name || "U")[0]}</div>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs opacity-60">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case "FAQ":
      return (
        <div className="py-10 sm:py-16 px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {(props.items || []).map((item: any, i: number) => (
              <details key={i} className="group rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors">
                  {item.question}
                  <span className="ml-2 text-gray-400 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm opacity-70 leading-relaxed">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      )
    case "CTA":
      return (
        <div className="py-12 sm:py-20 px-4 sm:px-8 text-center bg-[#8b5cf6] text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{props.headline || "Ready to Get Started?"}</h2>
          <button className="px-8 py-3 rounded-lg bg-white text-[#8b5cf6] font-semibold text-sm hover:opacity-90 transition-all">{props.cta || "Get Started"}</button>
        </div>
      )
    case "TrustBar":
      return (
        <div className="py-6 px-4 border-y border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm opacity-50 font-medium">
            {(props.logos || []).map((logo: string, i: number) => (
              <span key={i}>{logo}</span>
            ))}
          </div>
        </div>
      )
    case "Footer":
      return (
        <footer className="py-8 sm:py-12 px-4 sm:px-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-60">© 2026 All rights reserved</p>
            <div className="flex gap-4">
              {(props.links || []).map((link: any, i: number) => (
                <a key={i} href={link.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{link.label}</a>
              ))}
            </div>
          </div>
        </footer>
      )
    default:
      return null
  }
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [project, setProject] = useState<PreviewProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const projectId = searchParams.get("id")

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/get-by-id?id=${projectId}`)
        .then((r) => r.json())
        .then((d) => setProject(d.project))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [projectId])

  const devices = [
    { id: "desktop" as const, icon: Monitor, label: "Desktop" },
    { id: "tablet" as const, icon: Tablet, label: "Tablet" },
    { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
  ]

  const handleDownload = useCallback(async () => {
    if (!project) return
    setDownloading(true)
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: { name: project.name, type: project.type, prompt: project.prompt, theme: project.theme, pages: [{ path: "/", sections: project.sections || [] }] } }),
      })
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.zip`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) { console.error(err) }
    finally { setDownloading(false) }
  }, [project])

  const handleShare = useCallback(async () => {
    if (!project) return
    const url = `${window.location.origin}/preview?id=${project._id}`
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { prompt("Copy this link:", url) }
  }, [project])

  if (loading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>

  if (!project) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-replit-border">
            <Eye className="h-8 w-8 text-replit-muted" />
          </div>
          <h2 className="text-xl font-semibold text-replit-text mb-2">Project not found</h2>
          <p className="text-sm text-replit-muted mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const sections = project.sections || []
  const generatedCode = `// ${project.name} — Generated by BuildAI.Sites`

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-replit-border bg-white/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-replit-text truncate">{project.name}</h2>
                <p className="text-xs text-replit-muted hidden sm:block">{project.type === "LANDING_PAGE" ? "Landing Page" : "Website"}</p>
              </div>
              <Badge variant="success" className="hidden sm:inline-flex">Ready</Badge>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {devices.map((d) => (
                <button key={d.id} onClick={() => setDevice(d.id)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${device === d.id ? "bg-replit-hover text-replit-accent" : "text-replit-muted hover:text-replit-text"}`}>
                  <d.icon className="h-4 w-4" />
                </button>
              ))}
              <div className="w-px h-5 bg-replit-border mx-0.5 sm:mx-1" />
              <Button variant="ghost" size="sm" onClick={handleShare} className="hidden sm:inline-flex">
                {copied ? <Check className="mr-1 h-4 w-4 text-replit-green" /> : <Share2 className="mr-1 h-4 w-4" />}
                {copied ? "Copied!" : "Share"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload} disabled={downloading} className="hidden sm:inline-flex">
                <Download className="mr-1 h-4 w-4" /> {downloading ? "..." : "Download"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-3 sm:py-6">
        <div className="flex gap-2 mb-4 sm:mb-6">
          <button onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === "preview" ? "bg-replit-accent text-white" : "bg-white text-replit-muted hover:text-replit-text border border-replit-border"}`}>
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Preview
          </button>
          <button onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === "code" ? "bg-replit-accent text-white" : "bg-white text-replit-muted hover:text-replit-text border border-replit-border"}`}>
            <Code2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Code
          </button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={handleShare} className="sm:hidden">
            {copied ? <Check className="h-4 w-4 text-replit-green" /> : <Share2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} disabled={downloading} className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {activeTab === "preview" ? (
          <div className="flex justify-center">
            <div className={`relative rounded-2xl overflow-hidden border border-replit-border bg-white transition-all duration-500 ${device === "desktop" ? "w-full max-w-5xl aspect-video" : device === "tablet" ? "w-[600px] max-w-full aspect-[4/3]" : "w-[320px] max-w-full aspect-[9/19]"}`}>
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <div className="w-3 h-3 rounded-full bg-replit-red" />
                <div className="w-3 h-3 rounded-full bg-replit-amber" />
                <div className="w-3 h-3 rounded-full bg-replit-green" />
              </div>
              <div className="w-full h-full overflow-y-auto pt-10">
                {sections.length > 0 ? (
                  sections.map((section, i) => <SectionRenderer key={i} section={section} />)
                ) : (
                  <div className="p-6 sm:p-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl sm:text-4xl font-bold mb-3">{project.name}</h1>
                      <p className="text-sm sm:text-base opacity-60 max-w-xl mx-auto">{project.prompt}</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#8b5cf6] text-white text-sm font-semibold">Get Started</button>
                        <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold">Learn More</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {["AI-Powered", "Fast Performance", "Modern Design"].map((f) => (
                        <div key={f} className="p-4 rounded-xl border border-gray-200 text-center">
                          <h3 className="text-sm font-semibold mb-1">{f}</h3>
                          <p className="text-xs opacity-60">Generated by AI</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-replit-border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-replit-border">
              <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-replit-muted" /><span className="text-sm text-replit-muted">Source Code</span></div>
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(generatedCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                {copied ? <Check className="mr-1.5 h-4 w-4 text-replit-green" /> : <Copy className="mr-1.5 h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="p-4">
              <pre className="text-xs text-replit-muted font-mono leading-relaxed whitespace-pre-wrap break-all">{generatedCode}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Preview() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>}>
      <PreviewContent />
    </Suspense>
  )
}
