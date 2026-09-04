"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { ClientReadDto, ServiceReadDto, OrderServiceCreateDto } from "@/lib/types/dtos"
import { Loader2, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: ClientReadDto[]
  services: ServiceReadDto[]
  onSubmit: (
    description: string | undefined,
    clientId: string | undefined,
    services: OrderServiceCreateDto[],
  ) => Promise<void>
}

interface SelectedService {
  serviceId: string
  serviceName: string
  price: number
  count: number
}

export function OrderDialog({ open, onOpenChange, clients, services, onSubmit }: OrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Step 1 data
  const [description, setDescription] = useState("")
  const [clientId, setClientId] = useState<string>("none")

  // Step 2 data
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [currentServiceId, setCurrentServiceId] = useState<string>("")
  const [currentCount, setCurrentCount] = useState(1)

  const handleReset = () => {
    setStep(1)
    setDescription("")
    setClientId("none")
    setSelectedServices([])
    setCurrentServiceId("")
    setCurrentCount(1)
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const handleAddService = () => {
    if (!currentServiceId) return

    // Check if service already added
    if (selectedServices.some((s) => s.serviceId === currentServiceId)) {
      return
    }

    const service = services.find((s) => s.Id === currentServiceId)
    if (!service) return

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

  const handleUpdateCount = (serviceId: string, newCount: number) => {
    if (newCount < 1) return
    setSelectedServices(selectedServices.map((s) => (s.serviceId === serviceId ? { ...s, count: newCount } : s)))
  }

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price * s.count, 0)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const orderServices: OrderServiceCreateDto[] = selectedServices.map((s) => ({
        OrderId: "", // Will be set after order creation
        ServiceId: s.serviceId,
        Count: s.count,
      }))

      await onSubmit(description || undefined, clientId === "none" ? undefined : clientId, orderServices)

      handleClose()
    } catch (error) {
      console.error("[v0] Failed to create order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const availableServices = services.filter((s) => !selectedServices.some((selected) => selected.serviceId === s.Id))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order - Step {step} of 2</DialogTitle>
          <DialogDescription>{step === 1 ? "Enter order details" : "Add services to the order"}</DialogDescription>
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
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client (Optional)</Label>
              <Select value={clientId} onValueChange={setClientId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.Id} value={client.Id}>
                      {client.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Add Service</Label>
                  <div className="flex gap-2">
                    <Select value={currentServiceId} onValueChange={setCurrentServiceId} disabled={isLoading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map((service) => (
                          <SelectItem key={service.Id} value={service.Id}>
                            {service.ServiceName} - ${service.Price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min="1"
                      value={currentCount}
                      onChange={(e) => setCurrentCount(Number(e.target.value))}
                      className="w-24"
                      disabled={isLoading}
                    />

                    <Button type="button" onClick={handleAddService} disabled={!currentServiceId || isLoading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedServices.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Services</Label>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedServices.map((service) => (
                        <TableRow key={service.serviceId}>
                          <TableCell>{service.serviceName}</TableCell>
                          <TableCell>${service.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={service.count}
                              onChange={(e) => handleUpdateCount(service.serviceId, Number(e.target.value))}
                              className="w-20"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>${(service.price * service.count).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveService(service.serviceId)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">
                          Total:
                        </TableCell>
                        <TableCell className="font-semibold">${calculateTotal().toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={selectedServices.length === 0 || isLoading}>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
