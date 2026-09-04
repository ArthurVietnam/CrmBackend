"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { companyApi } from "@/lib/api/company"
import type { StatisticsReadDto } from "@/lib/types/dtos"
import { Users, ShoppingCart, DollarSign, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyDashboard() {
  const [stats, setStats] = useState<StatisticsReadDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await companyApi.getStatistics()
      setStats(data)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Clients",
      value: stats?.TotalClients ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Orders",
      value: stats?.TotalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.TotalRevenue?.toFixed(2) ?? "0.00"}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Total Appointments",
      value: stats?.TotalAppointments ?? 0,
      icon: Calendar,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-pretty">Welcome to your company dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{stat.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Navigate using the sidebar to manage your CRM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
