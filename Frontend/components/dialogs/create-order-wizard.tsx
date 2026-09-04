"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ClientReadDto, ServiceReadDto } from "@/lib/types/dtos"
import { Loader2, Plus, Trash2, Check } from "lucide-react"
import { ordersApi } from "@/lib/api/orders"
import { orderServicesApi } from "@/lib/api/order-services"

interface CreateOrderWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: ClientReadDto[]
  services: ServiceReadDto[]
  onSuccess: () => void
}

interface SelectedService {
  serviceId: string
  serviceName: string
  price: number
  count: number
}

export function CreateOrderWizard({ open, onOpenChange, clients, services, onSuccess }: CreateOrderWizardProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  // Step 1 data
  const [description, setDescription] = useState("")
  const [clientId, setClientId] = useState<string>("")

  // Step 2 data
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [currentServiceId, setCurrentServiceId] = useState<string>("")
  const [currentCount, setCurrentCount] = useState(1)

  const handleAddService = () => {
    if (!currentServiceId) return

    const service = services.find((s) => s.Id === currentServiceId)
    if (!service) return

    // Check if service already added
    if (selectedServices.some((s) => s.serviceId === currentServiceId)) {
      alert("This service is already added to the order")
      return
    }

    setSelectedServices([
      ...selectedServices,
      {
        serviceId: service.Id,
        serviceName: service.ServiceName,
        price: service.Price,
        count: currentCount,
      },
    ])

    setCurrentServiceId("")
    setCurrentCount(1)
  }

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.serviceId !== serviceId))
  }

  const totalSum = selectedServices.reduce((sum, s) => sum + s.price * s.count, 0)

  const handleCreateOrder = async () => {
    if (selectedServices.length === 0) {
      alert("Please add at least one service to the order")
      return
    }

    setIsLoading(true)
    try {
      // Step 1: Create empty order
      const order = await ordersApi.create({
        Description: description || undefined,
        ClientId: clientId || undefined,
      })

      setCreatedOrderId(order.Id)

      // Step 2: Add all services
      await Promise.all(
        selectedServices.map((service) =>
          orderServicesApi.create({
            OrderId: order.Id,
            ServiceId: service.serviceId,
            Count: service.count,
          }),
        ),
      )

      setStep(3)
      onSuccess()
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setDescription("")
    setClientId("")
    setSelectedServices([])
    setCurrentServiceId("")
    setCurrentCount(1)
    setCreatedOrderId(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order - Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter basic order information"}
            {step === 2 && "Add services to the order"}
            {step === 3 && "Order created successfully!"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Order description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client (Optional)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.Id} value={client.Id}>
                      {client.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Add Services</h3>
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select value={currentServiceId} onValueChange={setCurrentServiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.Id} value={service.Id}>
                          {service.ServiceName} - ${service.Price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentCount}
                    onChange={(e) => setCurrentCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-24"
                  />
                </div>

                <Button type="button" onClick={handleAddService} disabled={!currentServiceId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Selected Services</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedServices.map((service) => (
                      <TableRow key={service.serviceId}>
                        <TableCell>{service.serviceName}</TableCell>
                        <TableCell className="text-right">${service.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{service.count}</TableCell>
                        <TableCell className="text-right">${(service.price * service.count).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveService(service.serviceId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold">${totalSum.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={handleCreateOrder} disabled={isLoading || selectedServices.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center py-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Order Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">Order ID: {createdOrderId}</p>
            </div>
            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleClose()
                  // Could navigate to order details here
                }}
              >
                View Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
