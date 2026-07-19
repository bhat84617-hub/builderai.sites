import { NextResponse } from "next/server"
import { callLLM } from "@/lib/llm"
import { readLLMConfig } from "@/lib/server-llm-config"

export async function POST(req: Request) {
  try {
    const { prompt, type, style } = await req.json()
    const llmConfig = await readLLMConfig()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const systemPrompt = `You generate JSON for landing pages. Return ONLY valid JSON with this schema:
{
  "sections": [
    {
      "type": "Hero|Features|Pricing|Testimonials|FAQ|CTA|Footer|TrustBar",
      "props": {
        "headline": "Main headline based on user request",
        "subheadline": "Supporting text",
        "ctaPrimary": "Button text",
        "ctaSecondary": "Button text",
        "items": [{ "title": "...", "description": "..." }],
        "plans": [{ "name": "...", "price": "...", "features": ["..."], "cta": "..." }],
        "logos": ["str1","str2"],
        "question": "...", "answer": "...",
        "links": [{ "label": "...", "href": "..." }],
        "social": ["twitter","github"]
      }
    }
  ]
}

Rules:
- Hero section is REQUIRED
- CTA and Footer are REQUIRED
- Features/items must be tailored to the user's product, NOT generic
- Pricing must reflect real plans
- Content must be specific to the business described, NOT placeholder text
- Keep headlines short and punchy
- Never say "Get Started" or "Learn More" unless the user's business sells a service that needs those

User request: ${prompt}
Type: ${type || "LANDING_PAGE"}
Style: ${(style || []).join(", ")}`

    let sections = generateSections(prompt, type)

    if (llmConfig?.apiKey && llmConfig?.providerId) {
      try {
        const content = await callLLM(llmConfig, systemPrompt, prompt)
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed?.sections?.length >= 3) {
            sections = parsed.sections
          }
        }
      } catch {}
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

function extractName(prompt: string): string {
  const match = prompt.match(/for\s+([^\s,.]+)/i)
  return match ? match[1] : "Our Product"
}

function generateSections(prompt: string, type: string) {
  const name = extractName(prompt)
  const lower = prompt.toLowerCase()

  const sections: Record<string, unknown>[] = []

  sections.push({
    type: "Hero",
    props: {
      headline: name !== "Our Product" ? `Welcome to ${name}` : prompt.slice(0, 50),
      subheadline: prompt,
      ctaPrimary: "Get Started Free",
      ctaSecondary: "See Courses",
    },
  })

  if (lower.includes("course") || lower.includes("learn") || lower.includes("teach") || lower.includes("education")) {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "Expert Instructors", description: "Learn from industry professionals with years of real-world experience in their fields" },
          { title: "Interactive Learning", description: "Hands-on projects, quizzes, and community discussions to reinforce your skills" },
          { title: "Certificate on Completion", description: "Earn verified certificates to showcase your achievements on your resume" },
        ],
      },
    })
  } else if (lower.includes("shop") || lower.includes("store") || lower.includes("ecommerce") || lower.includes("product")) {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "Curated Collection", description: "Hand-picked products that meet our quality standards for durability and design" },
          { title: "Fast Shipping", description: "Free delivery on orders above ₹499 with guaranteed 3-5 day delivery" },
          { title: "Easy Returns", description: "30-day hassle-free return policy. No questions asked." },
        ],
      },
    })
  } else if (lower.includes("saas") || lower.includes("app") || lower.includes("software") || lower.includes("tool")) {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "Simple Setup", description: "Get started in minutes with no coding required. Import your data and go live." },
          { title: "Powerful Analytics", description: "Track usage, revenue, and growth with detailed real-time dashboards" },
          { title: "Team Collaboration", description: "Invite your team, set permissions, and work together seamlessly" },
        ],
      },
    })
  } else if (lower.includes("service") || lower.includes("consult") || lower.includes("agency")) {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "End-to-End Service", description: "From strategy to execution, we handle everything so you can focus on growth" },
          { title: "Dedicated Team", description: "Your projects get a dedicated account manager and a team of experts" },
          { title: "Proven Results", description: "Track record of 200+ successful projects across 15+ industries" },
        ],
      },
    })
  } else {
    sections.push({
      type: "Features",
      props: {
        items: [
          { title: "Why Choose Us", description: prompt.length > 80 ? prompt : `${prompt} — We deliver exceptional quality and results` },
          { title: "What We Offer", description: `Comprehensive solutions tailored to your needs in ${name}` },
          { title: "Our Promise", description: "Quality, reliability, and customer satisfaction guaranteed" },
        ],
      },
    })
  }

  sections.push({ type: "TrustBar", props: { logos: ["Trusted by 500+", "4.8★ Rating", "99% Uptime"] } })

  sections.push({
    type: "Pricing",
    props: {
      plans: [
        { name: "Starter", price: "₹99/mo", features: ["Basic features", "Email support"], cta: "Start Free" },
        { name: "Pro", price: "₹999/mo", features: ["Advanced features", "Priority support", "Analytics"], cta: "Get Pro" },
        { name: "Enterprise", price: "₹2,999/mo", features: ["Everything in Pro", "Dedicated manager", "Custom integrations"], cta: "Contact Us" },
      ],
    },
  })

  sections.push({
    type: "FAQ",
    props: {
      items: [
        { question: `What is ${name}?`, answer: `${name} is a platform that ${prompt.length > 60 ? prompt.slice(0, 120) : "helps you achieve your goals with our innovative solutions"}.` },
        { question: "How do I get started?", answer: "Simply sign up for free and explore our platform. No credit card required." },
        { question: "Can I cancel anytime?", answer: "Yes, you can cancel your subscription at any time. No hidden fees." },
      ],
    },
  })

  sections.push({ type: "CTA", props: { headline: `Ready to Start with ${name}?`, cta: "Get Started Free" } })
  sections.push({ type: "Footer", props: { links: [{ label: "Home", href: "/" }, { label: "About", href: "#" }, { label: "Contact", href: "#" }], social: ["twitter", "github"] } })

  return sections
}
