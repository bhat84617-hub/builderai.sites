"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wand2, Sparkles, Lightbulb, ArrowRight, Palette, Globe, Type, Image, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const suggestions = [
  "SaaS landing page for AI analytics, modern dark theme",
  "Portfolio for a creative photographer, minimal design",
  "E-commerce store for handmade jewelry, elegant style",
  "Blog for tech tutorials, clean and readable",
  "Restaurant website with online ordering, warm colors",
]

const pageTypes = [
  { id: "landing", label: "Landing Page", icon: FileText, desc: "Single page, high conversion" },
  { id: "multi", label: "Multi-Page Site", icon: Globe, desc: "5+ pages, full website" },
]

const styleOptions = [
  { id: "modern", label: "Modern", icon: Palette },
  { id: "minimal", label: "Minimal", icon: Type },
  { id: "playful", label: "Playful", icon: Sparkles },
  { id: "corporate", label: "Corporate", icon: Globe },
  { id: "dark", label: "Dark Mode", icon: Image },
  { id: "light", label: "Light Mode", icon: Image },
]

interface PromptInputProps {
  onGenerate: (prompt: string, options: { type: string; style: string[] }) => void
  initialPrompt?: string
}

export function PromptInput({ onGenerate, initialPrompt = "" }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [pageType, setPageType] = useState("landing")
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-slate-300 mb-3">What do you want to build?</label>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity" />
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website idea in detail... e.g., 'A modern SaaS landing page for an AI-powered analytics platform. Dark theme with purple accents. Include hero, features grid, pricing, testimonials, and FAQ sections.'"
              className="w-full min-h-[120px] bg-slate-900 border border-slate-700 rounded-2xl p-5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none text-sm leading-relaxed"
              rows={4}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Lightbulb
                className="h-4 w-4 text-slate-600 cursor-pointer hover:text-amber-400 transition-colors"
                onClick={() => setShowSuggestions(!showSuggestions)}
              />
              <span className="text-xs text-slate-600">{prompt.length} characters</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="px-3 py-1.5 rounded-full text-xs bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-purple-500/50 hover:text-slate-200 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-slate-300 mb-3">Page Type</label>
        <div className="grid grid-cols-2 gap-3">
          {pageTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPageType(type.id)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-300",
                pageType === type.id
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-slate-800 bg-slate-900/30 hover:border-slate-700"
              )}
            >
              <type.icon className={cn(
                "h-5 w-5 mb-2",
                pageType === type.id ? "text-purple-400" : "text-slate-500"
              )} />
              <p className="text-sm font-medium text-slate-200">{type.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-slate-300 mb-3">Style Preferences</label>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300",
                selectedStyles.includes(style.id)
                  ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                  : "border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
            >
              <style.icon className="h-3.5 w-3.5" />
              {style.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          size="xl"
          onClick={() => onGenerate(prompt, { type: pageType, style: selectedStyles })}
          disabled={!prompt.trim()}
          className="w-full sm:w-auto"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Website
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}
