"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code2, Image as ImageIcon, Zap, Check, Globe, Users, Sparkles, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function LandingPage() {
  const [prompt, setPrompt] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const handleGenerate = () => {
    const q = prompt.trim()
    if (q) router.push(`/generate?prompt=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-replit-border">
        <div className="absolute inset-0 bg-gradient-to-b from-replit-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-20 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1">100% Free • No Credit Card</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-replit-text mb-4">
            Build landing pages with{" "}
            <span className="bg-gradient-to-r from-replit-accent to-replit-blue bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-replit-muted text-lg max-w-2xl mx-auto mb-8">
            Describe your idea and get a beautiful, ready-to-deploy landing page in seconds. No coding required.
          </p>
          <div className="flex items-center gap-3 justify-center mb-12">
            <Link href={session?.user ? "/generate" : "/signup"}>
              <Button size="xl" className="bg-replit-accent hover:bg-replit-accent-hover">
                {session?.user ? "Create a Site" : "Get Started Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/preview?id=demo-p1">
              <Button size="xl" variant="secondary">See Demo</Button>
            </Link>
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 rounded-xl border border-replit-border bg-replit-card p-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Describe your site... e.g. 'A modern landing page for a startup'"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-replit-text placeholder:text-replit-muted outline-none"
              />
              <Button onClick={handleGenerate} size="sm" className="bg-replit-accent hover:bg-replit-accent-hover shrink-0">
                <Sparkles className="h-4 w-4 mr-1" /> Generate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-replit-text mb-3">Everything you need</h2>
          <p className="text-replit-muted">Build, preview, and ship — all in one place</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "AI-Powered", desc: "Describe your idea and AI generates a complete landing page with sections, styling, and copy." },
            { icon: Globe, title: "Live Preview", desc: "See your site in real-time with device toggle for desktop, tablet, and mobile views." },
            { icon: Zap, title: "One-Click Export", desc: "Download your site as a ZIP or deploy instantly. Fully functional HTML/CSS/JS." },
          ].map((f, i) => (
            <div key={i} className="rounded-xl border border-replit-border bg-replit-card p-6 hover:bg-replit-hover transition-colors">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-replit-accent/10">
                <f.icon className="h-5 w-5 text-replit-accent" />
              </div>
              <h3 className="font-semibold text-replit-text mb-1">{f.title}</h3>
              <p className="text-sm text-replit-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="border-t border-replit-border py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-replit-text mb-3">See it in action</h2>
            <p className="text-replit-muted">Generated from a single prompt</p>
          </div>
          <div className="rounded-xl border border-replit-border bg-replit-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-replit-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-replit-red" />
                <div className="h-3 w-3 rounded-full bg-replit-amber" />
                <div className="h-3 w-3 rounded-full bg-replit-green" />
              </div>
              <span className="text-xs text-replit-muted ml-3">buildai.sites / preview</span>
            </div>
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-replit-surface p-5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="mb-3 h-4 w-20 rounded bg-replit-accent/20" />
                    <div className="mb-2 h-3 w-full rounded bg-replit-border" />
                    <div className="mb-2 h-3 w-3/4 rounded bg-replit-border" />
                    <div className="h-3 w-1/2 rounded bg-replit-border" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-replit-text mb-3">Simple pricing</h2>
          <p className="text-replit-muted">Free to start. Upgrade when you need more.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { name: "Free", price: "$0", desc: "Perfect to get started", color: "bg-gray-500/20 text-gray-400", features: ["3 sites", "Basic templates", "Community support"] },
            { name: "Starter", price: "$9", desc: "For hobby projects", color: "bg-replit-accent/20 text-replit-accent", features: ["15 sites", "AI generation", "Priority generation", "Email support"], popular: true },
            { name: "Pro", price: "$29", desc: "For professionals", color: "bg-replit-blue/20 text-replit-blue", features: ["50 sites", "Priority AI", "Advanced templates", "Priority support", "Analytics"] },
            { name: "Agency", price: "$99", desc: "For teams & agencies", color: "bg-replit-amber/20 text-replit-amber", features: ["Unlimited sites", "White-label", "Team accounts", "API access", "Dedicated support"] },
          ].map((p, i) => (
            <div key={i} className={`rounded-xl border ${p.popular ? "border-replit-accent bg-replit-accent/5" : "border-replit-border bg-replit-card"} p-6 relative`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="premium">Most Popular</Badge></div>}
              <h3 className="text-lg font-bold text-replit-text">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-replit-text">{p.price}</span>
                <span className="text-sm text-replit-muted">/month</span>
              </div>
              <p className="text-sm text-replit-muted mt-1">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-replit-text">
                    <Check className="h-4 w-4 text-replit-green shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={session?.user ? "/pricing" : "/signup"}>
                <Button className="w-full mt-6" variant={p.popular ? "default" : "secondary"}>{p.name === "Free" ? "Get Started" : session?.user ? "Buy Now" : "Sign Up"}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-replit-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-replit-text mb-4">Start building today</h2>
          <p className="text-replit-muted mb-8">No credit card required. 100% free to start.</p>
          <Link href={session?.user ? "/generate" : "/signup"}>
            <Button size="xl" className="bg-replit-accent hover:bg-replit-accent-hover">
              {session?.user ? "Create Your First Site" : "Get Started Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-replit-border py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-replit-accent">
                <Code2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-replit-muted">BuildAI.Sites — AI-Powered Landing Pages</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-replit-muted hover:text-replit-text"><ExternalLink className="h-4 w-4" /></a>
              <a href="#" className="text-replit-muted hover:text-replit-text"><Globe className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}




