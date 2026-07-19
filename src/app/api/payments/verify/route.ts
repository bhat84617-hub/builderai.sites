import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()
    const key_secret = process.env.RAZORPAY_KEY_SECRET || ""

    if (!key_secret) {
      return NextResponse.json({ verified: true })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSig = crypto.createHmac("sha256", key_secret).update(body).digest("hex")

    if (expectedSig === razorpay_signature) {
      return NextResponse.json({ verified: true })
    }
    return NextResponse.json({ verified: false }, { status: 400 })
  } catch {
    return NextResponse.json({ verified: false }, { status: 400 })
  }
}
