"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Calendar,
  Briefcase,
  BarChart3,
  Building2,
  LogOut,
  UserCog,
} from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

const navigation = [
  { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/company/clients", icon: Users },
  { name: "Users", href: "/company/users", icon: UserCog },
  { name: "Orders", href: "/company/orders", icon: ShoppingCart },
  { name: "Appointments", href: "/company/appointments", icon: Calendar },
  { name: "Services", href: "/company/services", icon: Briefcase },
  { name: "Reports", href: "/company/reports", icon: BarChart3 },
  { name: "Company Profile", href: "/company/profile", icon: Building2 },
]

export function CompanySidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center" aria-label="CRM System home">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">CRM System</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-secondary")}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={logout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
