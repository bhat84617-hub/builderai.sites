"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { LayoutDashboard, ChevronDown, Code2, CreditCard, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-replit-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-replit-accent to-replit-accent-light">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-replit-text">
            Build<span className="text-replit-accent">AI</span>.Sites
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  <CreditCard className="h-4 w-4 mr-1.5" />
                  Plans
                </Button>
              </Link>
              <Link href="/generate">
                <Button size="sm" className="bg-replit-accent hover:bg-replit-accent-hover text-white">
                  + New Site
                </Button>
              </Link>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-replit-hover transition-colors">
                  <Avatar>
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>{(session.user.name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-replit-muted" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl border border-replit-border bg-white p-1 shadow-lg animate-scale-in">
                      <div className="px-3 py-2 border-b border-replit-border">
                        <p className="text-sm font-medium text-replit-text">{session.user.name}</p>
                        <p className="text-xs text-replit-muted">{session.user.email}</p>
                      </div>
                      <Link href="/pricing" onClick={() => setMenuOpen(false)}>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-replit-text hover:bg-replit-hover">
                          <CreditCard className="h-4 w-4" /> Upgrade Plan
                        </button>
                      </Link>
                      {session.user.email === "bhat84617@gmail.com" && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)}>
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-replit-text hover:bg-replit-hover">
                            <Settings className="h-4 w-4" /> Admin Panel
                          </button>
                        </Link>
                      )}
                      <button onClick={() => { signOut(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-replit-red hover:bg-replit-hover">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-replit-accent hover:bg-replit-accent-hover text-white">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
