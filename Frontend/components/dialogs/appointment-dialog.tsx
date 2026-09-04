"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type {
  AppointmentReadDto,
  AppointmentCreateDto,
  AppointmentUpdateDto,
  ClientReadDto,
  ServiceReadDto,
} from "@/lib/types/dtos"
import { StatusOfWork } from "@/lib/types/dtos"
import { Loader2 } from "lucide-react"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: AppointmentReadDto | null
  clients: ClientReadDto[]
  services: ServiceReadDto[]
  onSubmit: (data: AppointmentCreateDto | AppointmentUpdateDto) => Promise<void>
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  clients,
  services,
  onSubmit,
}: AppointmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const data = appointment
      ? ({
          DateTime: formData.get("dateTime") ? new Date(formData.get("dateTime") as string).toISOString() : undefined,
          Comment: (formData.get("comment") as string) || undefined,
        } as AppointmentUpdateDto)
      : ({
          ClientId: formData.get("clientId") as string,
          ServiceId: formData.get("serviceId") as string,
          DateTime: new Date(formData.get("dateTime") as string).toISOString(),
          Comment: (formData.get("comment") as string) || undefined,
          Status: Number(formData.get("status")) as StatusOfWork,
        } as AppointmentCreateDto)

    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Update appointment details" : "Create a new appointment for a client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!appointment && (
            <>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select name="clientId" required disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
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

              <div className="space-y-2">
                <Label htmlFor="serviceId">Service</Label>
                <Select name="serviceId" required disabled={isLoading}>
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
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={String(StatusOfWork.Sheduled)} required disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(StatusOfWork.Sheduled)}>Scheduled</SelectItem>
                    <SelectItem value={String(StatusOfWork.InProgress)}>In Progress</SelectItem>
                    <SelectItem value={String(StatusOfWork.Done)}>Done</SelectItem>
                    <SelectItem value={String(StatusOfWork.Canceled)}>Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {appointment && (
            <div className="space-y-2 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">
                Client: {clients.find((c) => c.Id === appointment.ClientId)?.Name || "Unknown"}
              </p>
              <p className="text-sm font-medium">
                Service: {services.find((s) => s.Id === appointment.ServiceId)?.ServiceName || "Unknown"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time{appointment && " (Optional)"}</Label>
            <Input
              id="dateTime"
              name="dateTime"
              type="datetime-local"
              defaultValue={
                appointment?.DateTime
                  ? new Date(appointment.DateTime).toISOString().slice(0, 16)
                  : new Date().toISOString().slice(0, 16)
              }
              required={!appointment}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Additional notes..."
              defaultValue={appointment?.Comment}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : appointment ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
