"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { PLANS, processPayment, type PaymentPlan } from "@/lib/payment"
import { Check, Loader2, Lock, Shield, CreditCard } from "lucide-react"

export default function PricingPage() {
  const { user, updatePlan } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => { if (!user) router.push("/login") }, [user, router])

  const handleBuy = async (plan: PaymentPlan) => {
    setLoading(plan.id)
    setMessage(null)
    const result = await processPayment("razorpay", plan)
    setLoading(null)
    if (result.success && user) {
      updatePlan(user.id, plan.id.toUpperCase() as "STARTER" | "PRO" | "AGENCY")
      setMessage({ type: "success", text: `Upgraded to ${plan.name}! 🎉` })
    } else if (result.error) {
      setMessage({ type: "error", text: result.error })
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center mb-10 animate-fade-in">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-replit-accent/10">
          <CreditCard className="h-7 w-7 text-replit-accent" />
        </div>
        <h1 className="text-3xl font-bold text-replit-text mb-2">Choose your plan</h1>
        <p className="text-replit-muted">Upgrade to unlock more sites and features</p>
      </div>

      {message && (
        <div className={`mx-auto max-w-md mb-8 rounded-xl border px-4 py-3 text-sm text-center animate-fade-in ${message.type === "success" ? "border-replit-green/30 bg-replit-green/5 text-replit-green" : "border-replit-red/30 bg-replit-red/5 text-replit-red"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
        {PLANS.map((plan) => {
          const isCurrent = user.plan === plan.id.toUpperCase()
          return (
            <Card key={plan.id} className={`relative overflow-hidden ${isCurrent ? "ring-2 ring-replit-accent" : ""}`}>
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-replit-accent to-replit-accent-light" />
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-replit-text">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-replit-text">₹{plan.price}</span>
                    <span className="text-sm text-replit-muted">/month</span>
                  </div>
                  <p className="text-sm text-replit-muted mt-1">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-replit-text">
                      <Check className="h-4 w-4 text-replit-green shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button className="w-full" variant="secondary" disabled>
                    <Check className="h-4 w-4 mr-1.5" /> Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-replit-accent hover:bg-replit-accent-hover text-white"
                    onClick={() => handleBuy(plan)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Processing...</>
                    ) : (
                      <><Lock className="h-4 w-4 mr-1.5" /> Buy with Razorpay</>
                    )}
                  </Button>
                )}

                <p className="mt-3 text-xs text-replit-muted text-center flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" /> Secure payment via Razorpay
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <p className="text-sm text-replit-muted">
          PayPal coming soon • 
          <button onClick={() => handleBuy(PLANS[0])} className="text-replit-accent hover:underline ml-1">Need help?</button>
        </p>
      </div>
    </div>
  )
}




