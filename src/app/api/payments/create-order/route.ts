import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { planId, amount, currency } = await req.json()
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx"
    const key_secret = process.env.RAZORPAY_KEY_SECRET || ""

    if (!key_secret) {
      return NextResponse.json({
        id: `order_demo_${Date.now()}`,
        amount,
        currency,
        key_id,
      })
    }

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64")
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: currency || "INR",
        receipt: `receipt_${planId}_${Date.now()}`,
        notes: { planId },
      }),
    })

    if (!res.ok) throw new Error("Razorpay order creation failed")
    const order = await res.json()
    return NextResponse.json({ ...order, key_id })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      { status: 500 }
    )
  }
}
