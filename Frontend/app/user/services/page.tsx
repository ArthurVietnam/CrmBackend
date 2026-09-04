"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { servicesApi } from "@/lib/api/services"
import type { ServiceReadDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ServiceDialog } from "@/components/dialogs/service-dialog"

export default function UserServicesPage() {
  const [services, setServices] = useState<ServiceReadDto[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceReadDto | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    const filtered = services.filter((service) => service.ServiceName.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredServices(filtered)
  }, [searchQuery, services])

  const loadServices = async () => {
    try {
      const data = await servicesApi.getByCompany()
      setServices(data)
      setFilteredServices(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      await servicesApi.create(data)
      toast({
        title: "Success",
        description: "Service created successfully",
      })
      loadServices()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingService) return
    try {
      await servicesApi.update(editingService.Id, data)
      toast({
        title: "Success",
        description: "Service updated successfully",
      })
      loadServices()
      setDialogOpen(false)
      setEditingService(undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      await servicesApi.delete(id)
      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
      loadServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setEditingService(undefined)
    setDialogOpen(true)
  }

  const openEditDialog = (service: ServiceReadDto) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Services</h1>
          <p className="text-muted-foreground text-pretty">Manage your services</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>View and manage all your services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No services found matching your search" : "No services yet"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.Id}>
                      <TableCell className="font-medium">{service.ServiceName}</TableCell>
                      <TableCell>${service.Price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(service.Id)}>
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

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingService}
        onSubmit={editingService ? handleUpdate : handleCreate}
      />
    </div>
  )
}
