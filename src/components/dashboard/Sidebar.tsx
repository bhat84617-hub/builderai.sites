"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, Wand2, Settings, FolderOpen, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Projects", icon: LayoutDashboard },
  { href: "/generate", label: "New Project", icon: Wand2 },
]

export function Sidebar({ activePath }: { activePath?: string }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] border-r border-slate-800/50 bg-slate-950/50 p-4">
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">BuildAI.Sites</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group",
                activePath === item.href
                  ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-slate-100 border border-purple-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4",
                activePath === item.href ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {item.label}
              {activePath === item.href && (
                <ChevronRight className="ml-auto h-4 w-4 text-purple-400" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-purple-500/20">
            <p className="text-xs font-medium text-purple-300 mb-1">Free Plan</p>
            <p className="text-xs text-slate-500 mb-3">1 landing page included</p>
            <Link href="/#pricing">
              <span className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">Upgrade →</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
