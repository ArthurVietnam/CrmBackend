"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { clientsApi } from "@/lib/api/clients"
import type { ClientReadDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientDialog } from "@/components/dialogs/client-dialog"

export default function UserClientsPage() {
  const [clients, setClients] = useState<ClientReadDto[]>([])
  const [filteredClients, setFilteredClients] = useState<ClientReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientReadDto | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.Phone?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredClients(filtered)
  }, [searchQuery, clients])

  const loadClients = async () => {
    try {
      const data = await clientsApi.getByCompany()
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

  const handleCreate = async (data: any) => {
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

  const handleUpdate = async (data: any) => {
    if (!editingClient) return
    try {
      await clientsApi.update(editingClient.Id, data)
      toast({
        title: "Success",
        description: "Client updated successfully",
      })
      loadClients()
      setDialogOpen(false)
      setEditingClient(undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return
    try {
      await clientsApi.delete(id)
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
      loadClients()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setEditingClient(undefined)
    setDialogOpen(true)
  }

  const openEditDialog = (client: ClientReadDto) => {
    setEditingClient(client)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Clients</h1>
          <p className="text-muted-foreground text-pretty">Manage your clients</p>
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
                placeholder="Search clients..."
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
              {searchQuery ? "No clients found matching your search" : "No clients yet"}
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
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(client.Id)}>
                            <Trash2 className="h-4 w-4" />
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
        onSubmit={editingClient ? handleUpdate : handleCreate}
      />
    </div>
  )
}
