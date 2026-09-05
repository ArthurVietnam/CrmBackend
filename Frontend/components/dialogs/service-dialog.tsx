"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ServiceReadDto, ServiceCreateDto, ServiceUpdateDto } from "@/lib/types/dtos"
import { Loader2 } from "lucide-react"

interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: ServiceReadDto | null
  onSubmit: (data: ServiceCreateDto | ServiceUpdateDto) => Promise<void>
}

export function ServiceDialog({ open, onOpenChange, service, onSubmit }: ServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = service
      ? {
          ServiceName: (formData.get("name") as string) || undefined,
          Price: formData.get("price") ? Number.parseFloat(formData.get("price") as string) : undefined,
          Id: service.Id,
        }
      : {
          ServiceName: formData.get("name") as string,
          Price: Number.parseFloat(formData.get("price") as string),
        }

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
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service ? "Update service information" : "Create a new service offering"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name{service && " (Optional)"}</Label>
            <Input id="name" name="name" defaultValue={service?.ServiceName} required={!service} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($){service && " (Optional)"}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={service?.Price}
              required={!service}
              disabled={isLoading}
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
              ) : service ? (
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
