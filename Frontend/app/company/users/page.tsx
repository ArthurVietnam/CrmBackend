"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usersApi } from "@/lib/api/users"
import type { UserReadDto, UserCreateDto, UserUpdateDto } from "@/lib/types/dtos"
import { UserRole } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UserDialog } from "@/components/dialogs/user-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [users, setUsers] = useState<UserReadDto[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserReadDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserReadDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.Phone.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: UserCreateDto) => {
    try {
      await usersApi.create(data)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      loadUsers()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: UserUpdateDto) => {
    if (!editingUser) return
    try {
      await usersApi.update(editingUser.Id, data)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      loadUsers()
      setDialogOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    try {
      await usersApi.delete(userToDelete.Id)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      loadUsers()
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (user: UserReadDto) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const openDeleteDialog = (user: UserReadDto) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleRoleChange = async (userId: string, newRole: number) => {
    try {
      await usersApi.updateRole(userId, newRole)
      toast({
        title: "Success",
        description: "User role updated",
      })
      loadUsers()
    } catch (error) {
      console.error("Failed to update role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: number) => {
    const config = {
      [UserRole.Employee]: { label: "Employee", variant: "secondary" as const },
      [UserRole.Admin]: { label: "Admin", variant: "default" as const },
    }
    const { label, variant } = config[role] || { label: "Unknown", variant: "outline" as const }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Users</h1>
          <p className="text-muted-foreground text-pretty">Manage your company users</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>View and manage all company users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No users found matching your search" : "No users yet. Add your first user!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.Id}>
                      <TableCell className="font-medium">{user.Name}</TableCell>
                      <TableCell>{user.Email}</TableCell>
                      <TableCell>{user.Phone || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={String(user.Role)}
                          onValueChange={(value) => handleRoleChange(user.Id, Number(value))}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue>{getRoleBadge(user.Role)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={String(UserRole.Employee)}>Employee</SelectItem>
                            <SelectItem value={String(UserRole.Admin)}>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
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

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSubmit={editingUser ? handleUpdate : handleCreate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{userToDelete?.Name}". This action cannot be undone.
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
