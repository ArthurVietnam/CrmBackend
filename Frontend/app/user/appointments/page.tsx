"use client"

import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { appointmentsApi } from "@/lib/api/appointments"
import { clientsApi } from "@/lib/api/clients"
import { servicesApi } from "@/lib/api/services"
import type { AppointmentReadDto, AppointmentCreateDto, ClientReadDto, ServiceReadDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Search, CalendarIcon, Plus, Pencil } from "lucide-react"
import { AppointmentDialog } from "@/components/dialogs/appointment-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentReadDto[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentReadDto[]>([])
  const [clients, setClients] = useState<ClientReadDto[]>([])
  const [services, setServices] = useState<ServiceReadDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentReadDto | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = appointments

    if (searchQuery) {
      filtered = filtered.filter((appointment) => {
        const clientName = getClientName(appointment.ClientId)
        const serviceName = getServiceName(appointment.ServiceId)
        return (
          clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.Comment?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    if (statusFilter !== "all") {
      const statusMap: Record<string, number> = {
        Scheduled: 0,
        Confirmed: 1,
        Completed: 2,
        Cancelled: 3,
      }
      filtered = filtered.filter((appointment) => appointment.Status === statusMap[statusFilter])
    }

    setFilteredAppointments(filtered)
  }, [searchQuery, statusFilter, appointments, clients, services])

  const loadData = async () => {
    try {
      const [appointmentsData, clientsData, servicesData] = await Promise.all([
        appointmentsApi.getByCompany(),
        clientsApi.getByCompany(),
        servicesApi.getByCompany(),
      ])
      setAppointments(appointmentsData)
      setFilteredAppointments(appointmentsData)
      setClients(clientsData)
      setServices(servicesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      await appointmentsApi.create(data)
      toast({
        title: "Success",
        description: "Appointment created successfully",
      })
      loadData()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingAppointment) return
    try {
      await appointmentsApi.update(Number(editingAppointment.Id), data)
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
      loadData()
      setDialogOpen(false)
      setEditingAppointment(undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setEditingAppointment(undefined)
    setDialogOpen(true)
  }

  const openEditDialog = (appointment: AppointmentReadDto) => {
    setEditingAppointment(appointment)
    setDialogOpen(true)
  }

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.Id === clientId)
    return client?.Name || "Unknown Client"
  }

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s.Id === serviceId)
    return service?.ServiceName || "Unknown Service"
  }

  const getStatusBadge = (status: number) => {
    const statusNames = ["Scheduled", "In Progress", "Done", "Canceled"]
    const variants: Record<number, "default" | "secondary" | "destructive" | "outline"> = {
      0: "outline",
      1: "secondary",
      2: "default",
      3: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{statusNames[status] || "Unknown"}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Appointments</h1>
          <p className="text-muted-foreground text-pretty">View and manage your appointments</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Schedule</CardTitle>
          <CardDescription>All your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by service..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Confirmed">In Progress</SelectItem>
                <SelectItem value="Completed">Done</SelectItem>
                <SelectItem value="Cancelled">Canceled</SelectItem>
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
                : "No appointments yet"}
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
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.Id}>
                      <TableCell className="font-medium">{getClientName(appointment.ClientId)}</TableCell>
                      <TableCell>{getServiceName(appointment.ServiceId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {new Date(appointment.DateTime).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.Comment || "-"}</TableCell>
                      <TableCell>{getStatusBadge(appointment.Status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(appointment)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editingAppointment ?? null}
        onSubmit={(data) => editingAppointment ? handleUpdate(data) : handleCreate(data as AppointmentCreateDto)}
        clients={clients}
        services={services}
      />
    </div>
  )
}
