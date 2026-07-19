import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import ClientLayout from "./ClientLayout"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BuildAI.Sites – AI-Powered Landing Pages",
  description: "Build beautiful landing pages with AI — 100% free",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <ClientLayout>
          <Navbar />
          <main className="pt-16">{children}</main>
        </ClientLayout>
      </body>
    </html>
  )
}
