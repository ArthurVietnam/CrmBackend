"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { OrderReadDto, OrderServiceReadDto, ServiceReadDto } from "@/lib/types/dtos"
import { Calendar, DollarSign, FileText, Loader2 } from "lucide-react"
import { orderServicesApi } from "@/lib/api/order-services"
import { StatusOfWork } from "@/lib/types/dtos"

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: OrderReadDto | null
  services: ServiceReadDto[]
}

export function OrderDetailsDialog({ open, onOpenChange, order, services }: OrderDetailsDialogProps) {
  const [orderServices, setOrderServices] = useState<OrderServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (order && open) {
      loadOrderServices()
    }
  }, [order, open])

  const loadOrderServices = async () => {
    if (!order) return

    setIsLoading(true)
    try {
      const servicesData = await orderServicesApi.getByOrder(order.Id)
      setOrderServices(servicesData)
    } catch (error) {
      console.error("Error loading order services:", error)
    } finally {
      setIsLoading(false)
    }
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

  const getServiceNameByPrice = (price: number): string => {
    const service = services.find((s) => Math.abs(s.Price - price) < 0.01)
    return service?.ServiceName || "Unknown Service"
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete information about this order</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Order Date</p>
                <p className="text-sm text-muted-foreground">{new Date(order.Date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-sm text-muted-foreground">${order.Sum.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {order.Description && (
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{order.Description}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <p className="text-sm font-medium">Status</p>
            {getStatusBadge(order.Status)}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Services</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : orderServices.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderServices.map((service) => (
                      <TableRow key={service.Id}>
                        <TableCell>{getServiceNameByPrice(service.Price)}</TableCell>
                        <TableCell className="text-right">${service.Price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{service.Count}</TableCell>
                        <TableCell className="text-right">${service.TotalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No services added to this order</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
