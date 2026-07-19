"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import type { PlanType } from "@/lib/store"
import { LayoutGrid, List as ListIcon, Plus, Search, ExternalLink, Crown, Clock, Code2, Sparkles, Loader2 } from "lucide-react"
import type { IProject } from "@/lib/models"

const planColors: Record<PlanType, string> = {
  FREE: "bg-gray-500/10 text-gray-500",
  STARTER: "bg-replit-accent/10 text-replit-accent",
  PRO: "bg-replit-blue/10 text-replit-blue",
  AGENCY: "bg-replit-amber/10 text-replit-amber",
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetch("/api/projects/get")
        .then((r) => r.json())
        .then((d) => setProjects(d.projects || []))
        .finally(() => setLoading(false))
    }
  }, [session])

  if (status === "loading" || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>
  }

  if (!session?.user) return null

  const filtered = projects.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-replit-text">
              Welcome back, <span className="text-replit-accent">{(session.user.name || "User").split(" ")[0]}</span>
            </h1>
            <p className="text-replit-muted mt-1">Manage your sites and account</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 text-sm"><Crown className="h-3.5 w-3.5 mr-1" /> Free Plan</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-replit-muted" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sites..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${view === "grid" ? "bg-replit-accent text-white" : "text-replit-muted hover:text-replit-text hover:bg-replit-hover"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-replit-accent text-white" : "text-replit-muted hover:text-replit-text hover:bg-replit-hover"}`}>
                <ListIcon className="h-4 w-4" />
              </button>
              <Link href="/generate">
                <Button size="sm" className="bg-replit-accent hover:bg-replit-accent-hover ml-2">
                  <Plus className="h-4 w-4 mr-1" /> New Site
                </Button>
              </Link>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-replit-border p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <Sparkles className="h-6 w-6 text-replit-muted" />
              </div>
              <h3 className="text-lg font-medium text-replit-text mb-1">No sites yet</h3>
              <p className="text-sm text-replit-muted mb-4">Create your first AI-powered landing page</p>
              <Link href="/generate">
                <Button className="bg-replit-accent hover:bg-replit-accent-hover text-white">
                  <Plus className="h-4 w-4 mr-1" /> Create Site
                </Button>
              </Link>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((p) => (
                <Card key={p._id} className="group hover:bg-replit-hover transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-replit-accent/10">
                        <Code2 className="h-5 w-5 text-replit-accent" />
                      </div>
                      <Badge variant={p.status === "READY" ? "success" : "default"}>{p.status}</Badge>
                    </div>
                    <h3 className="font-semibold text-replit-text mb-1 truncate">{p.name}</h3>
                    <p className="text-xs text-replit-muted line-clamp-2 mb-3">{p.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-replit-muted">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/preview?id=${p._id}`}>
                          <button className="rounded p-1 hover:bg-replit-hover text-replit-muted hover:text-replit-text">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-replit-border overflow-hidden">
              {filtered.map((p) => (
                <div key={p._id} className="flex items-center justify-between border-b border-replit-border px-4 py-3 last:border-0 hover:bg-replit-hover transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-replit-accent/10">
                      <Code2 className="h-4 w-4 text-replit-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-replit-text truncate">{p.name}</p>
                      <p className="text-xs text-replit-muted truncate">{p.prompt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={p.status === "READY" ? "success" : "default"} className="text-xs">{p.status}</Badge>
                    <Link href={`/preview?id=${p._id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-replit-amber" />
                <h3 className="font-semibold text-sm text-replit-text">Your Plan</h3>
              </div>
              <div className="mb-3">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-500/10 text-gray-500">FREE</span>
              </div>
              <div className="space-y-2 text-sm text-replit-muted">
                <div className="flex justify-between">
                  <span>Sites used</span>
                  <span className="text-replit-text">{projects.length} / 3</span>
                </div>
              </div>
              <Link href="/pricing">
                <Button variant="secondary" className="w-full mt-3 text-xs">Upgrade Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-replit-muted" />
                <h3 className="font-semibold text-sm text-replit-text">Recent Activity</h3>
              </div>
              {projects.length === 0 ? (
                <p className="text-xs text-replit-muted">No activity yet</p>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p._id} className="flex items-center gap-2 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-replit-green shrink-0" />
                      <span className="text-replit-text truncate">{p.name}</span>
                      <span className="text-replit-muted shrink-0">• {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}




