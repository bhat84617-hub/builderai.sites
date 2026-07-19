"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import type { PlanType } from "@/lib/store"
import { Users, Globe, Crown, TrendingUp, Code2, Zap, Loader2 } from "lucide-react"

const planColors: Record<string, string> = {
  FREE: "bg-gray-500/10 text-gray-500",
  STARTER: "bg-replit-accent/10 text-replit-accent",
  PRO: "bg-replit-blue/10 text-replit-blue",
  AGENCY: "bg-replit-amber/10 text-replit-amber",
}

interface UserData {
  _id: string
  name: string
  email: string
  plan: PlanType
  projects: { _id: string }[]
  joinedAt: string
  provider: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (session?.user && session.user.email !== "bhat84617@gmail.com") router.push("/dashboard")
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.email === "bhat84617@gmail.com") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => setUsers(d.users || []))
        .finally(() => setLoading(false))
    }
  }, [session])

  if (status === "loading" || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="h-8 w-8 text-replit-accent animate-spin" /></div>
  }

  if (!session?.user || session.user.email !== "bhat84617@gmail.com") return null

  const totalUsers = users.length
  const totalProjects = users.reduce((a, u) => a + (u.projects?.length || 0), 0)
  const planDist = { FREE: 0, STARTER: 0, PRO: 0, AGENCY: 0 }
  users.forEach((u) => { if (u.plan in planDist) planDist[u.plan]++ })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-replit-text">Admin Dashboard</h1>
        <p className="text-replit-muted mt-1">Monitor platform usage and users</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: totalUsers, color: "text-replit-blue" },
          { icon: Globe, label: "Total Sites", value: totalProjects, color: "text-replit-green" },
          { icon: Crown, label: "Paid Users", value: planDist.STARTER + planDist.PRO + planDist.AGENCY, color: "text-replit-amber" },
          { icon: TrendingUp, label: "Free Users", value: planDist.FREE, color: "text-replit-muted" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-replit-muted">{s.label}</p>
                  <p className="text-2xl font-bold text-replit-text mt-1">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(["FREE", "STARTER", "PRO", "AGENCY"] as PlanType[]).map((plan) => {
                const count = planDist[plan] || 0
                const pct = totalUsers ? Math.round((count / totalUsers) * 100) : 0
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <Badge className={planColors[plan]}>{plan}</Badge>
                      <span className="text-replit-text font-medium">{count} users ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-replit-border">
                      <div className="h-full rounded-full bg-gradient-to-r from-replit-accent to-replit-blue transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-replit-muted">Manage your platform settings and API configuration.</p>
            <Link href="/admin/settings">
              <Button variant="secondary" className="w-full"><Zap className="h-4 w-4 mr-1.5" /> AI Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-replit-border">
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">User</th>
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">Plan</th>
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">Sites</th>
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">Joined</th>
                  <th className="text-left py-3 px-2 text-replit-muted font-medium">Provider</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-replit-border/50 hover:bg-replit-hover transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-replit-accent/20 text-xs font-medium text-replit-accent">{u.name[0]}</div>
                        <span className="text-replit-text">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-replit-muted">{u.email}</td>
                    <td className="py-3 px-2"><Badge className={planColors[u.plan]}>{u.plan}</Badge></td>
                    <td className="py-3 px-2 text-replit-text">{u.projects?.length || 0}</td>
                    <td className="py-3 px-2 text-replit-muted text-xs">{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{u.provider}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


