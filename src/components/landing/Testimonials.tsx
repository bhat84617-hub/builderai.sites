"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Indie Founder",
    content: "Built my entire landing page in 5 minutes. The AI got my vision perfectly. This is insane.",
    initials: "RS",
  },
  {
    name: "Priya Patel",
    role: "Marketing Lead",
    content: "We use BuildAI for campaign pages. The speed of iteration is unmatched. Game changer for our team.",
    initials: "PP",
  },
  {
    name: "Amit Kumar",
    role: "Freelance Developer",
    content: "The code quality is impressive. I download and deploy immediately. Saves me days of work.",
    initials: "AK",
  },
  {
    name: "Neha Singh",
    role: "Agency Owner",
    content: "White-label potential is huge. My clients love the designs. BuildAI is now part of our workflow.",
    initials: "NS",
  },
]

export function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">Creators</span>
          </h2>
          <p className="text-slate-400">Join thousands building with AI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl border border-slate-800/50 bg-slate-900/30 hover:border-slate-700/80 hover:bg-slate-900/50 transition-all duration-500">
                <Quote className="h-8 w-8 text-purple-500/30 mb-4" />
                <p className="text-slate-300 leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
