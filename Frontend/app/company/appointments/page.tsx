"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { appointmentsApi } from "@/lib/api/appointments"
import { clientsApi } from "@/lib/api/clients"
import { servicesApi } from "@/lib/api/services"
import type {
  AppointmentReadDto,
  AppointmentCreateDto,
  AppointmentUpdateDto,
  ClientReadDto,
  ServiceReadDto,
} from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2, CalendarIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { AppointmentDialog } from "@/components/dialogs/appointment-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentReadDto[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentReadDto[]>([])
  const [clients, setClients] = useState<ClientReadDto[]>([])
  const [services, setServices] = useState<ServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentReadDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentReadDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = appointments

    if (searchQuery) {
      filtered = filtered.filter((appointment) => {
        const client = clients.find((c) => c.Id === appointment.ClientId)
        const service = services.find((s) => s.Id === appointment.ServiceId)
        return (
          client?.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service?.ServiceName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    if (statusFilter !== "all") {
      const statusNumber = statusFilter === "all" ? null : Number(statusFilter)
      filtered = filtered.filter((appointment) => statusNumber === null || appointment.Status === statusNumber)
    }

    setFilteredAppointments(filtered)
  }, [searchQuery, statusFilter, appointments, clients, services])

  const loadData = async () => {
    try {
      const [appointmentsData, clientsData, servicesData] = await Promise.all([
        appointmentsApi.getAll(),
        clientsApi.getAll(),
        servicesApi.getAll(),
      ])
      setAppointments(appointmentsData)
      setFilteredAppointments(appointmentsData)
      setClients(clientsData)
      setServices(servicesData)
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: AppointmentCreateDto) => {
    try {
      await appointmentsApi.create(data)
      toast({
        title: "Success",
        description: "Appointment created successfully",
      })
      loadData()
      setDialogOpen(false)
    } catch (error) {
      console.error("[v0] Failed to create appointment:", error)
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: AppointmentUpdateDto) => {
    if (!editingAppointment) return
    try {
      await appointmentsApi.update(Number(editingAppointment.Id), data)
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
      loadData()
      setDialogOpen(false)
      setEditingAppointment(null)
    } catch (error) {
      console.error("[v0] Failed to update appointment:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (appointmentId: string, newStatus: number) => {
    try {
      await appointmentsApi.updateStatus(appointmentId, newStatus)
      toast({
        title: "Success",
        description: "Appointment status updated",
      })
      loadData()
    } catch (error) {
      console.error("[v0] Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!appointmentToDelete) return
    try {
      await appointmentsApi.delete(Number(appointmentToDelete.Id))
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })
      loadData()
      setDeleteDialogOpen(false)
      setAppointmentToDelete(null)
    } catch (error) {
      console.error("[v0] Failed to delete appointment:", error)
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (appointment: AppointmentReadDto) => {
    setEditingAppointment(appointment)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingAppointment(null)
    setDialogOpen(true)
  }

  const openDeleteDialog = (appointment: AppointmentReadDto) => {
    setAppointmentToDelete(appointment)
    setDeleteDialogOpen(true)
  }

  const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: "Scheduled",
      1: "In Progress",
      2: "Done",
      3: "Canceled",
    }
    return statusMap[status] || "Unknown"
  }

  const getStatusBadge = (status: number) => {
    const variants: Record<number, "default" | "secondary" | "destructive" | "outline"> = {
      0: "outline",
      1: "secondary",
      2: "default",
      3: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{getStatusText(status)}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Appointments</h1>
          <p className="text-muted-foreground text-pretty">Schedule and manage client appointments</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>View and manage all scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by client or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="0">Scheduled</SelectItem>
                <SelectItem value="1">In Progress</SelectItem>
                <SelectItem value="2">Done</SelectItem>
                <SelectItem value="3">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No appointments found matching your filters"
                : "No appointments yet. Schedule your first appointment!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const client = clients.find((c) => c.Id === appointment.ClientId)
                    const service = services.find((s) => s.Id === appointment.ServiceId)

                    return (
                      <TableRow key={appointment.Id}>
                        <TableCell className="font-medium">{client?.Name || "Unknown Client"}</TableCell>
                        <TableCell>{service?.ServiceName || "Unknown Service"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            {new Date(appointment.DateTime).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{appointment.Comment || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={String(appointment.Status)}
                            onValueChange={(value) => handleStatusChange(appointment.Id, Number(value))}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>{getStatusBadge(appointment.Status)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Scheduled</SelectItem>
                              <SelectItem value="1">In Progress</SelectItem>
                              <SelectItem value="2">Done</SelectItem>
                              <SelectItem value="3">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(appointment)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(appointment)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editingAppointment}
        clients={clients}
        services={services}
        onSubmit={(data) =>
          editingAppointment ? handleUpdate(data as AppointmentUpdateDto) : handleCreate(data as AppointmentCreateDto)
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appointment with{" "}
              {clients.find((c) => c.Id === appointmentToDelete?.ClientId)?.Name || "this client"}. This action cannot
              be undone.
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
