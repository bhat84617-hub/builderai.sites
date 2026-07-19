"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Download, Eye, ExternalLink, FileCode2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import type { Project, ProjectStatus } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"

const statusConfig: Record<ProjectStatus, { label: string; variant: "success" | "warning" | "secondary" | "destructive" }> = {
  READY: { label: "Ready", variant: "success" },
  GENERATING: { label: "Generating", variant: "warning" },
  DRAFT: { label: "Draft", variant: "secondary" },
  FAILED: { label: "Failed", variant: "destructive" },
}

const gradients = [
  "from-violet-600 to-purple-600",
  "from-cyan-500 to-emerald-500",
  "from-fuchsia-600 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-purple-600 to-cyan-500",
]

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const status = statusConfig[project.status]
  const gradient = gradients[index % gradients.length]
  const isReady = project.status === "READY"

  const handleDownload = async () => {
    if (!isReady) return
    setDownloading(true)
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: {
            name: project.name,
            type: project.type,
            prompt: project.prompt,
            theme: {
              colors: { primary: "#7C3AED", secondary: "#06B6D4", background: "#030712", surface: "#111827", text: "#F9FAFB", muted: "#9CA3AF" },
              fonts: { display: "Space Grotesk", body: "DM Sans" },
            },
            pages: [{ path: "/", sections: [{ type: "Hero", props: { headline: project.name } }] }],
          },
        }),
      })
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download error:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/30 overflow-hidden hover:border-slate-700/80 transition-all duration-500">
        <Link href={isReady ? `/preview?id=${project.id}` : "#"} onClick={(e) => { if (!isReady) e.preventDefault() }}>
          <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMMTAgMTBtMTAgMTBsMTAgLTEwTTIwIDIwbDEwIDEwTTIwIDIwbC0xMCAxMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge variant={status.variant}>{status.label}</Badge>
              {!isReady && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Preview unavailable
                </Badge>
              )}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-100 text-sm truncate">{project.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => isReady && router.push(`/preview?id=${project.id}`)} disabled={!isReady}>
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload} disabled={!isReady || downloading}>
                  <Download className="mr-2 h-4 w-4" /> {downloading ? "Downloading..." : "Download"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload} disabled={!isReady}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Deploy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-400">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-slate-500 line-clamp-1 mb-3">{project.prompt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <FileCode2 className="h-3.5 w-3.5" />
              <span>{project.type === "LANDING_PAGE" ? "Landing Page" : "Website"}</span>
            </div>
            <span className="text-xs text-slate-600">
              {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
