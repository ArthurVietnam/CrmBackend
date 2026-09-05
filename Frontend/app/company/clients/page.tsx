"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientsApi } from "@/lib/api/clients"
import type { ClientReadDto, ClientCreateDto, ClientUpdateDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientDialog } from "@/components/dialogs/client-dialog"
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

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientReadDto[]>([])
  const [filteredClients, setFilteredClients] = useState<ClientReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientReadDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ClientReadDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.Email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.Phone ?? "").includes(searchQuery),
    )
    setFilteredClients(filtered)
  }, [searchQuery, clients])

  const loadClients = async () => {
    try {
      const data = await clientsApi.getAll()
      setClients(data)
      setFilteredClients(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: ClientCreateDto) => {
    try {
      await clientsApi.create(data)
      toast({
        title: "Success",
        description: "Client created successfully",
      })
      loadClients()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: ClientUpdateDto) => {
    if (!editingClient) return
    try {
      await clientsApi.update(Number(editingClient.Id), data)
      toast({
        title: "Success",
        description: "Client updated successfully",
      })
      loadClients()
      setDialogOpen(false)
      setEditingClient(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!clientToDelete) return
    try {
      await clientsApi.delete(Number(clientToDelete.Id))
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
      loadClients()
      setDeleteDialogOpen(false)
      setClientToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (client: ClientReadDto) => {
    setEditingClient(client)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingClient(null)
    setDialogOpen(true)
  }

  const openDeleteDialog = (client: ClientReadDto) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Clients</h1>
          <p className="text-muted-foreground text-pretty">Manage your client database</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>View and manage all your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or phone..."
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
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No clients found matching your search" : "No clients yet. Add your first client!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.Id}>
                      <TableCell className="font-medium">{client.Name}</TableCell>
                      <TableCell>{client.Email || "-"}</TableCell>
                      <TableCell>{client.Phone || "-"}</TableCell>
                      <TableCell>{client.Comment || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client)}>
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

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSubmit={(data) =>
          editingClient ? handleUpdate(data as ClientUpdateDto) : handleCreate(data as ClientCreateDto)
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client "{clientToDelete?.Name}". This action cannot be undone.
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
