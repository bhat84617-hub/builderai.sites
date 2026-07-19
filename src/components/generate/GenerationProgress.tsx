"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, CheckCircle2, Loader2, FileCode2, Palette, Image, Globe, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const steps = [
  { id: "analyzing", label: "Analyzing your prompt", icon: Sparkles, description: "Understanding your requirements" },
  { id: "design", label: "Generating design system", icon: Palette, description: "Creating colors, typography, and layout" },
  { id: "images", label: "Creating images", icon: Image, description: "Generating AI images and icons" },
  { id: "code", label: "Writing code", icon: FileCode2, description: "Building React components and pages" },
  { id: "optimizing", label: "Optimizing & polishing", icon: Zap, description: "Adding animations and responsiveness" },
  { id: "ready", label: "Ready!", icon: Globe, description: "Your site is generated" },
]

interface GenerationProgressProps {
  progress: number
  currentStep: string
  isComplete: boolean
  onViewResult?: () => void
}

export function GenerationProgress({ progress, currentStep, isComplete, onViewResult }: GenerationProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-100">
            {isComplete ? "Generation Complete!" : "Building Your Site..."}
          </h3>
          <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isDone = index < currentIndex || (index === currentIndex && isComplete)

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all duration-500",
                isActive && !isComplete
                  ? "bg-purple-500/10 border border-purple-500/20"
                  : isDone
                  ? "bg-emerald-500/5"
                  : "opacity-40"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                isDone
                  ? "bg-emerald-500/20 text-emerald-400"
                  : isActive
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-slate-800 text-slate-600"
              )}>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDone ? "text-emerald-300" : isActive ? "text-purple-300" : "text-slate-500"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-600">{step.description}</p>
              </div>
              {isDone && !isComplete && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {isComplete && onViewResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={onViewResult}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="h-5 w-5" />
                View Your Site
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
