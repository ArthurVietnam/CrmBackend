"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ordersApi } from "@/lib/api/orders"
import { orderServicesApi } from "@/lib/api/order-services"
import { clientsApi } from "@/lib/api/clients"
import { servicesApi } from "@/lib/api/services"
import type { OrderReadDto, ClientReadDto, ServiceReadDto, OrderServiceCreateDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Trash2, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderDialog } from "@/components/dialogs/order-dialog"
import { OrderDetailsDialog } from "@/components/dialogs/order-details-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusOfWork } from "@/lib/types/dtos"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderReadDto[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderReadDto[]>([])
  const [clients, setClients] = useState<ClientReadDto[]>([])
  const [services, setServices] = useState<ServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<OrderReadDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<OrderReadDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.Id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.Status === Number(statusFilter))
    }

    setFilteredOrders(filtered)
  }, [searchQuery, statusFilter, orders])

  const loadData = async () => {
    try {
      const [ordersData, clientsData, servicesData] = await Promise.all([
        ordersApi.getAll(),
        clientsApi.getAll(),
        servicesApi.getAll(),
      ])
      setOrders(ordersData)
      setFilteredOrders(ordersData)
      setClients(clientsData)
      setServices(servicesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (
    description: string | undefined,
    clientId: string | undefined,
    orderServices: OrderServiceCreateDto[],
  ) => {
    try {
      const newOrder = await ordersApi.create({
        Description: description,
        ClientId: clientId,
      })

      for (const service of orderServices) {
        await orderServicesApi.create({
          OrderId: newOrder.Id,
          ServiceId: service.ServiceId,
          Count: service.Count,
        })
      }

      toast({
        title: "Success",
        description: "Order created successfully with services",
      })
      loadData()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDelete = async () => {
    if (!orderToDelete) return
    try {
      await ordersApi.delete(orderToDelete.Id)
      toast({
        title: "Success",
        description: "Order deleted successfully",
      })
      loadData()
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus)
      toast({
        title: "Success",
        description: "Order status updated",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setDialogOpen(true)
  }

  const openDetailsDialog = (order: OrderReadDto) => {
    setViewingOrder(order)
    setDetailsDialogOpen(true)
  }

  const openDeleteDialog = (order: OrderReadDto) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: StatusOfWork) => {
    const config = {
      [StatusOfWork.Sheduled]: { label: "Scheduled", variant: "outline" as const },
      [StatusOfWork.InProgress]: { label: "In Progress", variant: "secondary" as const },
      [StatusOfWork.Done]: { label: "Done", variant: "default" as const },
      [StatusOfWork.Canceled]: { label: "Canceled", variant: "destructive" as const },
    }
    const { label, variant } = config[status] || { label: "Unknown", variant: "outline" as const }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.Id === clientId)
    return client?.Name || "No client"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Orders</h1>
          <p className="text-muted-foreground text-pretty">Manage your orders and track their status</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>View and manage all your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by description or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={String(StatusOfWork.Sheduled)}>Scheduled</SelectItem>
                <SelectItem value={String(StatusOfWork.InProgress)}>In Progress</SelectItem>
                <SelectItem value={String(StatusOfWork.Done)}>Done</SelectItem>
                <SelectItem value={String(StatusOfWork.Canceled)}>Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No orders found matching your filters"
                : "No orders yet. Create your first order!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.Id}>
                      <TableCell className="font-medium">#{order.Id.slice(0, 8)}</TableCell>
                      <TableCell>{getClientName(order.ClientId)}</TableCell>
                      <TableCell>{order.Description || "-"}</TableCell>
                      <TableCell>${order.Sum.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={String(order.Status)}
                          onValueChange={(value) => handleStatusChange(order.Id, Number(value))}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>{getStatusBadge(order.Status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={String(StatusOfWork.Sheduled)}>Scheduled</SelectItem>
                            <SelectItem value={String(StatusOfWork.InProgress)}>In Progress</SelectItem>
                            <SelectItem value={String(StatusOfWork.Done)}>Done</SelectItem>
                            <SelectItem value={String(StatusOfWork.Canceled)}>Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(order.Date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(order)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clients={clients}
        services={services}
        onSubmit={handleCreate}
      />

      <OrderDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        order={viewingOrder}
        services={services}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete order #{orderToDelete?.Id.slice(0, 8)}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
