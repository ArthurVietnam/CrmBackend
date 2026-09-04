"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ClientReadDto, ClientCreateDto, ClientUpdateDto } from "@/lib/types/dtos"
import { Loader2 } from "lucide-react"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: ClientReadDto | null
  onSubmit: (data: ClientCreateDto | ClientUpdateDto) => Promise<void>
}

export function ClientDialog({ open, onOpenChange, client, onSubmit }: ClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      Name: formData.get("name") as string,
      Email: (formData.get("email") as string) || undefined,
      Phone: (formData.get("phone") as string) || undefined,
      Comment: (formData.get("comment") as string) || undefined,
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
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>{client ? "Update client information" : "Create a new client record"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={client?.Name} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" name="email" type="email" defaultValue={client?.Email} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={client?.Phone} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Input id="comment" name="comment" defaultValue={client?.Comment} disabled={isLoading} />
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
              ) : client ? (
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
