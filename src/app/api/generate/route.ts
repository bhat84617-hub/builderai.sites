import { NextResponse } from "next/server"
import { callLLM } from "@/lib/llm"
import { readLLMConfig } from "@/lib/server-llm-config"

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
const HF_TOKEN = process.env.HF_TOKEN || ""

export async function POST(req: Request) {
  try {
    const { prompt, type, style } = await req.json()
    const llmConfig = await readLLMConfig()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const systemPrompt = `You are a website generator. Given a user's description, generate a complete website specification as JSON.
Follow this exact schema, return ONLY valid JSON:
{
  "project": {
    "name": "string",
    "type": "LANDING_PAGE"
  },
  "pages": [{
    "path": "/",
    "sections": [
      {
        "type": "Hero|Features|Pricing|Testimonials|FAQ|CTA|Footer|TrustBar",
        "props": {}
      }
    ]
  }]
}

User request: ${prompt}
Type: ${type || "LANDING_PAGE"}
Style: ${(style || []).join(", ")}

Generate at minimum: Hero, Features, CTA, Footer sections. Include Pricing/Testimonials/FAQ if relevant.`

    let sections = generateFallbackSections(prompt, type)
    let usedAI = false

    // Try configured LLM provider first (from admin settings, saved on server)
    if (llmConfig?.apiKey && llmConfig?.providerId) {
      try {
        const content = await callLLM(llmConfig, systemPrompt, prompt)
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed?.pages?.[0]?.sections) {
            sections = parsed.pages[0].sections
            usedAI = true
          }
        }
      } catch (e) {
        console.warn("LLM provider failed, trying fallback:", e instanceof Error ? e.message : "unknown")
      }
    }

    // Try HuggingFace as second fallback
    if (!usedAI && HF_TOKEN) {
      try {
        const response = await fetch(HF_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `<s>[INST] ${systemPrompt} [/INST]`,
            parameters: { max_new_tokens: 1024, temperature: 0.7, return_full_text: false },
          }),
        })

        if (response.ok) {
          const result = await response.json()
          const generatedText = result[0]?.generated_text || ""
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            sections = JSON.parse(jsonMatch[0])
          }
        }
      } catch {
        // Use template fallback
      }
    }

    const theme = generateTheme(prompt)

    return NextResponse.json({
      project: {
        name: prompt.split(",")[0].trim().slice(0, 60),
        type: type === "multi" ? "WEBSITE" : "LANDING_PAGE",
        theme,
      },
      pages: [{ path: "/", sections }],
    })
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}

function generateTheme(prompt: string) {
  const lower = prompt.toLowerCase()
  const isDark = lower.includes("dark")
  const isPlayful = lower.includes("playful") || lower.includes("fun") || lower.includes("creative")
  const isCorporate = lower.includes("corporate") || lower.includes("professional") || lower.includes("business")

  return {
    colors: {
      primary: isPlayful ? "#7C3AED" : isCorporate ? "#2563EB" : "#7C3AED",
      secondary: isPlayful ? "#22D3EE" : isCorporate ? "#10B981" : "#06B6D4",
      background: isDark ? "#030712" : "#FFFFFF",
      surface: isDark ? "#111827" : "#F8FAFC",
      text: isDark ? "#F9FAFB" : "#0F172A",
      muted: isDark ? "#9CA3AF" : "#64748B",
    },
    fonts: { display: "Space Grotesk", body: "DM Sans" },
    radius: "xl",
    style: isPlayful ? "playful" : isCorporate ? "corporate" : "modern",
  }
}

function generateHeadline(prompt: string): string {
  const words = prompt.split(" ")
  return words.length >= 4 ? `${words.slice(0, 3).join(" ")} — Reimagined` : "Your Vision, Built by AI"
}

function generateFallbackSections(prompt: string, type: string) {
  const lower = prompt.toLowerCase()
  const hasFeatures = lower.includes("feature") || lower.includes("service")
  const hasPricing = lower.includes("pricing") || lower.includes("price") || lower.includes("plan")
  const hasTestimonials = lower.includes("testimonial") || lower.includes("review")
  const hasFAQ = lower.includes("faq") || lower.includes("question")

  const sections: Record<string, unknown>[] = []

  sections.push({
    type: "Hero",
    props: {
      headline: generateHeadline(prompt),
      subheadline: "Built with AI. Powered by your ideas.",
      ctaPrimary: "Get Started",
      ctaSecondary: "Learn More",
    },
  })

  if (hasFeatures) {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "AI-Powered", description: "Generate content and design with artificial intelligence" },
          { title: "Fast Performance", description: "Optimized for speed and performance" },
          { title: "Modern Design", description: "Beautiful, responsive designs that work everywhere" },
        ],
      },
    })
  }

  sections.push({ type: "TrustBar", props: { logos: ["TechCrunch", "Forbes", "Product Hunt"] } })

  if (hasTestimonials) {
    sections.push({
      type: "Testimonials",
      props: {
        items: [
          { name: "User 1", role: "Founder", content: "This platform transformed how we build websites." },
          { name: "User 2", role: "Developer", content: "Incredible quality and speed. Game changer." },
        ],
      },
    })
  }

  if (hasPricing) {
    sections.push({
      type: "Pricing",
      props: {
        plans: [
          { name: "Free", price: "₹0", features: ["Basic features", "Community support"] },
          { name: "Pro", price: "₹999", features: ["Advanced features", "Priority support"] },
          { name: "Enterprise", price: "Custom", features: ["Full suite", "Dedicated support"] },
        ],
      },
    })
  }

  if (hasFAQ) {
    sections.push({
      type: "FAQ",
      props: {
        items: [
          { question: "How does it work?", answer: "Simply describe your idea and AI builds it." },
          { question: "Can I download the code?", answer: "Yes! Full source code is available for download." },
        ],
      },
    })
  }

  sections.push({ type: "CTA", props: { headline: "Ready to Get Started?", cta: "Start Free" } })
  sections.push({ type: "Footer", props: { links: [{ label: "Home", href: "/" }, { label: "Features", href: "#" }, { label: "Contact", href: "#" }], social: ["twitter", "github"] } })

  return sections
}
