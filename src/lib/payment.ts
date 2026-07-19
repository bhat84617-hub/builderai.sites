export type PaymentProviderType = "razorpay" | "paypal"

export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  description: string
  features: string[]
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

export const PLANS: PaymentPlan[] = [
  { id: "free", name: "Free", price: 0, currency: "INR", description: "Get started for free", features: ["1 landing page", "Basic AI generation", "Community templates"] },
  { id: "starter", name: "Starter", price: 99, currency: "INR", description: "For hobby projects", features: ["1 landing page", "AI generation", "Email support"] },
  { id: "pro", name: "Pro", price: 999, currency: "INR", description: "For professionals", features: ["Full site", "Priority AI", "Advanced templates", "Priority support"] },
  { id: "agency", name: "Agency", price: 2999, currency: "INR", description: "For teams & agencies", features: ["50 sites", "100 landing pages", "White-label", "Team accounts", "API access", "Dedicated support"] },
]

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export async function payWithRazorpay(plan: PaymentPlan): Promise<PaymentResult> {
  try {
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: plan.id, amount: plan.price * 100, currency: "INR" }),
    })
    if (!orderRes.ok) throw new Error("Failed to create order")
    const order = await orderRes.json()

    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx",
        amount: order.amount,
        currency: order.currency,
        name: "BuildAI.Sites",
        description: `${plan.name} Plan`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })
          const data = await verifyRes.json()
          resolve({ success: data.verified, transactionId: response.razorpay_payment_id })
        },
        modal: {
          ondismiss: () => resolve({ success: false, error: "Payment cancelled" }),
        },
        prefill: { contact: "", email: "" },
        theme: { color: "#8b5cf6" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Payment failed" }
  }
}

export async function payWithPayPal(plan: PaymentPlan): Promise<PaymentResult> {
  return { success: false, error: "PayPal coming soon" }
}

export async function processPayment(provider: PaymentProviderType, plan: PaymentPlan): Promise<PaymentResult> {
  switch (provider) {
    case "razorpay": return payWithRazorpay(plan)
    case "paypal": return payWithPayPal(plan)
  }
}
