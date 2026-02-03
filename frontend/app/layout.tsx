import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import type React from "react"
import { ApolloProvider } from "@/components/providers/apollo-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import "./globals.css"
import {
  Geist_Mono as V0_Font_Geist_Mono,
  Inter as V0_Font_Inter,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google"

// Initialize fonts
const _inter = V0_Font_Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "ProjectFlow - Project Management",
  description: "A modern project management application with Kanban boards",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ApolloProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProvider>
        <Analytics />
      </body>
    </html>
  )
}
