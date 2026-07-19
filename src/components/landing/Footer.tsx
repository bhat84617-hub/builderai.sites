"use client"

import { Sparkles, GitBranch, MessageCircle, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold">
                <span className="text-gradient">BuildAI</span>
                <span className="text-slate-400">.Sites</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-md">
              Transform your ideas into production-ready websites with AI.
              No coding required. Full source code included.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link></li>
              <li><Link href="/generate" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Generate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-400" /> by BuildAI.Sites
          </p>
          <div className="flex items-center gap-4">
              <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">
              <GitBranch className="h-4 w-4" />
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
