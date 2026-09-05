"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { servicesApi } from "@/lib/api/services"
import type { ServiceReadDto, ServiceCreateDto, ServiceUpdateDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ServiceDialog } from "@/components/dialogs/service-dialog"
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

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceReadDto[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceReadDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<ServiceReadDto | null>(null)
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
      const data = await servicesApi.getAll()
      setServices(data)
      setFilteredServices(data)
    } catch (error) {
      console.error("Failed to load services:", error)
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: ServiceCreateDto) => {
    try {
      await servicesApi.create(data)
      toast({
        title: "Success",
        description: "Service created successfully",
      })
      loadServices()
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to create service:", error)
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: ServiceUpdateDto) => {
    if (!editingService) return
    try {
      await servicesApi.update(Number(editingService.Id), data)
      toast({
        title: "Success",
        description: "Service updated successfully",
      })
      loadServices()
      setDialogOpen(false)
      setEditingService(null)
    } catch (error) {
      console.error("Failed to update service:", error)
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    try {
      await servicesApi.delete(Number(serviceToDelete.Id))
      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
      loadServices()
      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    } catch (error) {
      console.error("Failed to delete service:", error)
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (service: ServiceReadDto) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingService(null)
    setDialogOpen(true)
  }

  const openDeleteDialog = (service: ServiceReadDto) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Services</h1>
          <p className="text-muted-foreground text-pretty">Manage your service catalog</p>
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
                placeholder="Search services by name..."
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
              {searchQuery ? "No services found matching your search" : "No services yet. Add your first service!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
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
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(service)}>
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

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingService}
        onSubmit={(data) =>
          editingService
            ? handleUpdate(data as ServiceUpdateDto)
            : handleCreate(data as ServiceCreateDto)
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete?.ServiceName}". This action cannot be undone.
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
