"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for getting started",
    icon: Sparkles,
    gradient: "from-slate-600 to-slate-500",
    features: [
      "1 landing page (watermarked)",
      "10 AI image credits",
      "Basic components",
      "Community support",
      "Preview only",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Starter",
    price: "₹99",
    period: "/mo",
    description: "For individuals and freelancers",
    icon: Zap,
    gradient: "from-cyan-500 to-emerald-500",
    features: [
      "1 landing page / month",
      "50 AI image credits",
      "Full code download",
      "Email support",
      "Preview deploy",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    description: "For professionals and agencies",
    icon: Crown,
    gradient: "from-violet-600 to-fuchsia-600",
    features: [
      "Unlimited landing pages",
      "1 multi-page site / month",
      "200 AI image credits",
      "One-click deploy (Vercel/Netlify)",
      "Priority support",
      "Premium components",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Agency",
    price: "₹2,999",
    period: "/mo",
    description: "For teams and scaling businesses",
    icon: Crown,
    gradient: "from-fuchsia-600 to-rose-500",
    features: [
      "100 landing pages / month",
      "50 multi-page sites / month",
      "1,000 AI image credits",
      "Custom domain support",
      "Dedicated support",
      "White-label export (coming soon)",
    ],
    cta: "Contact Us",
    href: "/signup",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-slate-400">Start free. Upgrade when you grow.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative group ${
                plan.popular ? "lg:-mt-4 lg:mb-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-semibold text-white shadow-lg">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative h-full p-6 rounded-2xl border transition-all duration-500 ${
                plan.popular
                  ? "border-purple-500/50 bg-slate-900/80 shadow-xl shadow-purple-500/10"
                  : "border-slate-800/50 bg-slate-900/30 hover:border-slate-700/80"
              }`}>
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4 shadow-lg`}>
                  <plan.icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-slate-100">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
