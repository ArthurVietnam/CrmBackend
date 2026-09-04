"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { companyApi } from "@/lib/api/company"
import type { CompanyReadDto, CompanyUpdateDto } from "@/lib/types/dtos"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building2, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyReadDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await companyApi.getMyCompany()
      setProfile(data)
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast({
        title: "Error",
        description: "Failed to load company profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)

    const updateData: CompanyUpdateDto = {}

    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const email = formData.get("email") as string

    console.log("[v0] Form values:", { name, location, email })

    if (name && name.trim()) updateData.Name = name.trim()
    if (location && location.trim()) updateData.Location = location.trim()
    if (email && email.trim()) updateData.Email = email.trim()

    console.log("[v0] Update data being sent:", updateData)
    console.log("[v0] Update data keys:", Object.keys(updateData))

    try {
      await companyApi.updateProfile(updateData)
      await loadProfile()
      toast({
        title: "Success",
        description: "Company profile updated successfully",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update company profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Company Profile</h1>
        <p className="text-muted-foreground text-pretty">Manage your company information and subscription</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name (Optional)</Label>
                <Input id="name" name="name" defaultValue={profile?.Name} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input id="location" name="location" defaultValue={profile?.Location} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" defaultValue={profile?.Email} disabled={isSaving} />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <span className={`text-sm font-medium ${profile?.IsActive ? "text-green-500" : "text-destructive"}`}>
                    {profile?.IsActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expires On</span>
                  <span className="text-sm font-medium">
                    {profile?.SubscriptionEnd ? new Date(profile.SubscriptionEnd).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Renew Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
