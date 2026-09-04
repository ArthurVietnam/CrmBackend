"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User, ShoppingCart, Calendar, Home, Users, Wrench } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, userType, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || userType !== "user") {
      router.push("/")
    }
  }, [isAuthenticated, userType, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { href: "/user", label: "Dashboard", icon: Home },
    { href: "/user/orders", label: "My Orders", icon: ShoppingCart },
    { href: "/user/appointments", label: "My Appointments", icon: Calendar },
    { href: "/user/clients", label: "Clients", icon: Users },
    { href: "/user/services", label: "Services", icon: Wrench },
    { href: "/user/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">User Portal</h1>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
