"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserReadDto, UserCreateDto, UserUpdateDto } from "@/lib/types/dtos"
import { UserRole } from "@/lib/types/dtos"
import { Loader2 } from "lucide-react"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserReadDto | null
  onSubmit: (data: UserCreateDto | UserUpdateDto) => Promise<void>
}

export function UserDialog({ open, onOpenChange, user, onSubmit }: UserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>(user ? String(user.Role) : String(UserRole.Employee))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string

    const data: any = user
      ? {
          Name: (formData.get("name") as string) || undefined,
          Email: (formData.get("email") as string) || undefined,
          Phone: (formData.get("phone") as string) || undefined,
          Role: selectedRole ? Number(selectedRole) : undefined,
        }
      : {
          Name: formData.get("name") as string,
          Email: formData.get("email") as string,
          Password: password,
          Phone: (formData.get("phone") as string) || undefined,
          Role: Number(selectedRole),
        }

    if (user && password) {
      data.Password = password
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
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>{user ? "Update user information" : "Create a new user account"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name{user && " (Optional)"}</Label>
            <Input id="name" name="name" defaultValue={user?.Name} required={!user} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email{user && " (Optional)"}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.Email}
              required={!user}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={user?.Phone} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role{user && " (Optional)"}</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(UserRole.Employee)}>Employee</SelectItem>
                <SelectItem value={String(UserRole.Admin)}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password {user && "(leave blank to keep current)"}</Label>
            <Input id="password" name="password" type="password" required={!user} disabled={isLoading} />
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
              ) : user ? (
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
