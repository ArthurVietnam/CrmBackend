"use client"

import type React from "react"

import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CompanySidebar } from "@/components/layout/company-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userType, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== "company")) {
      router.push("/")
    }
  }, [isAuthenticated, userType, isLoading, router])

  if (isLoading || !isAuthenticated || userType !== "company") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CompanySidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
