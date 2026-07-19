"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore, type PlanType } from "@/lib/store"
import { Users, Globe, Crown, TrendingUp, Code2, Zap } from "lucide-react"

const planColors: Record<PlanType, string> = {
  FREE: "bg-gray-500/20 text-gray-400",
  STARTER: "bg-replit-accent/20 text-replit-accent",
  PRO: "bg-replit-blue/20 text-replit-blue",
  AGENCY: "bg-replit-amber/20 text-replit-amber",
}

export default function AdminPage() {
  const { user, users, getAdminStats } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.email !== "bhat84617@gmail.com") router.push("/dashboard")
  }, [user, router])

  if (!user || user.email !== "bhat84617@gmail.com") return null

  const stats = getAdminStats()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-replit-text">Admin Dashboard</h1>
        <p className="text-replit-muted mt-1">Monitor platform usage and users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-replit-blue" },
          { icon: Globe, label: "Total Sites", value: stats.totalProjects, color: "text-replit-green" },
          { icon: Crown, label: "Paid Users", value: stats.planDistribution.STARTER + stats.planDistribution.PRO + stats.planDistribution.AGENCY, color: "text-replit-amber" },
          { icon: TrendingUp, label: "Free Users", value: stats.planDistribution.FREE, color: "text-replit-muted" },
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

      {/* Plan Distribution */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(["FREE", "STARTER", "PRO", "AGENCY"] as PlanType[]).map((plan) => {
                const count = stats.planDistribution[plan]
                const total = stats.totalUsers || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <Badge className={planColors[plan]}>{plan}</Badge>
                      <span className="text-replit-text font-medium">{count} users ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-replit-border">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-replit-accent to-replit-blue transition-all"
                        style={{ width: `${pct}%` }}
                      />
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

      {/* All Users */}
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
                  <tr key={u.id} className="border-b border-replit-border/50 hover:bg-replit-hover transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-replit-accent/20 text-xs font-medium text-replit-accent">
                          {u.name[0]}
                        </div>
                        <span className="text-replit-text">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-replit-muted">{u.email}</td>
                    <td className="py-3 px-2">
                      <Badge className={planColors[u.plan]}>{u.plan}</Badge>
                    </td>
                    <td className="py-3 px-2 text-replit-text">{u.projects.length}</td>
                    <td className="py-3 px-2 text-replit-muted text-xs">{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary" className="text-xs">{u.provider}</Badge>
                    </td>
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
