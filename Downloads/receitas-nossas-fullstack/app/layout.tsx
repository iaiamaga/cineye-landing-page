import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Receitas Nossas - BodhiSabores",
  description: "Descubra sabores únicos e compartilhe momentos especiais com receitas que aquecem o coração",
  keywords: "receitas, culinária, comida, cozinha, BodhiSabores",
  authors: [{ name: "BodhiSabores" }],
  openGraph: {
    title: "Receitas Nossas - BodhiSabores",
    description: "Descubra sabores únicos e compartilhe momentos especiais",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
