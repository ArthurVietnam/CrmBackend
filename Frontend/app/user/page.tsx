"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ordersApi } from "@/lib/api/orders"
import { appointmentsApi } from "@/lib/api/appointments"
import type { OrderReadDto, AppointmentReadDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Calendar, CheckCircle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function UserDashboard() {
  const [orders, setOrders] = useState<OrderReadDto[]>([])
  const [appointments, setAppointments] = useState<AppointmentReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ordersData, appointmentsData] = await Promise.all([
        ordersApi.getByCompany(),
        appointmentsApi.getByCompany(),
      ])
      setOrders(ordersData)
      setAppointments(appointmentsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const completedOrders = orders.filter((o) => o.Status === 2).length // StatusOfWork.Done = 2
  const pendingOrders = orders.filter((o) => o.Status === 0 || o.Status === 1).length // Sheduled or InProgress
  const upcomingAppointments = appointments.filter((a) => a.Status === 0).length // StatusOfWork.Sheduled = 0

  const recentOrders = orders.slice(0, 5)
  const upcomingAppointmentsList = appointments.filter((a) => a.Status === 0).slice(0, 5)

  const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: "Scheduled",
      1: "In Progress",
      2: "Done",
      3: "Canceled",
    }
    return statusMap[status] || "Unknown"
  }

  const getStatusBadge = (status: number) => {
    const variants: Record<number, "default" | "secondary" | "destructive" | "outline"> = {
      0: "outline", // Scheduled
      1: "secondary", // InProgress
      2: "default", // Done
      3: "destructive", // Canceled
    }
    return <Badge variant={variants[status] || "outline"}>{getStatusText(status)}</Badge>
  }

  const statCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments,
      icon: Calendar,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-pretty">Overview of your orders and appointments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stat.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.Id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{order.Description || "Order"}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.Date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.Sum.toFixed(2)}</p>
                      {getStatusBadge(order.Status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : upcomingAppointmentsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointmentsList.map((appointment) => (
                  <div key={appointment.Id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Appointment</p>
                      <p className="text-sm text-muted-foreground">{new Date(appointment.DateTime).toLocaleString()}</p>
                    </div>
                    <div className="text-right">{getStatusBadge(appointment.Status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
