"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Loader2 } from "lucide-react"
import { usersApi } from "@/lib/api/users"
import type { UserReadDto } from "@/lib/types/dtos"

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserReadDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profileData = await usersApi.getMyProfile()
      setProfile(profileData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Profile</h1>
          <p className="text-muted-foreground text-pretty">View your personal information</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Profile</h1>
        <p className="text-muted-foreground text-pretty">View your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-6">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
              <dd className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.Name || "—"}</span>
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.Email || "—"}</span>
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
              <dd className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.Phone || "—"}</span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
