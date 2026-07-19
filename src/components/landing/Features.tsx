"use client"

import { motion } from "framer-motion"
import { Sparkles, Palette, Download, Image, Zap, Layout, Shield, Globe } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Describe your idea in natural language and get a production-ready website in minutes.",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    icon: Palette,
    title: "Unique Designs",
    description: "Every site is uniquely generated. No templates, no repetition — AI-crafted designs every time.",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    icon: Download,
    title: "Full Code Export",
    description: "Download complete Next.js + TypeScript + Tailwind source code. Full ownership.",
    gradient: "from-fuchsia-600 to-rose-500",
  },
  {
    icon: Image,
    title: "AI Image Generation",
    description: "Hero images, illustrations, and icons generated with AI to match your brand.",
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Animations Built-In",
    description: "Smooth page transitions, scroll reveals, and micro-interactions included.",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Layout,
    title: "50+ Components",
    description: "Hero, Features, Pricing, Testimonials, FAQ — all pre-built and animated.",
    gradient: "from-violet-600 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Modern Stack",
    description: "Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.",
    gradient: "from-purple-600 to-cyan-500",
  },
  {
    icon: Globe,
    title: "One-Click Deploy",
    description: "Deploy to Vercel or Netlify directly from your dashboard with one click.",
    gradient: "from-fuchsia-600 to-emerald-500",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Build Fast</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From AI generation to deployment — all in one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 to-slate-800/0 group-hover:from-slate-800/50 group-hover:to-slate-800/30 rounded-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl border border-slate-800/50 group-hover:border-slate-700/80 transition-all duration-500">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
