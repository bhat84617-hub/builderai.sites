"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"

export function DemoShowcase() {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const devices = [
    { id: "desktop" as const, icon: Monitor, label: "Desktop" },
    { id: "tablet" as const, icon: Tablet, label: "Tablet" },
    { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
  ]

  return (
    <section className="relative py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See It in <span className="text-gradient">Action</span>
          </h2>
          <p className="text-slate-400">Preview your generated sites across all devices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-8"
        >
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => setActiveDevice(device.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeDevice === device.id
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              <device.icon className="h-4 w-4" />
              {device.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeDevice}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div
            className={`relative glow-purple rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 ${
              activeDevice === "desktop"
                ? "w-full max-w-5xl aspect-video"
                : activeDevice === "tablet"
                ? "w-[600px] aspect-[4/3]"
                : "w-[320px] aspect-[9/19]"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 mb-4">
                  <Monitor className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-slate-400 text-sm">Your generated site preview will appear here</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
