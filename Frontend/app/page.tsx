"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const router = useRouter()
  const { login, isAuthenticated, userType } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (userType === "company") {
      router.push("/company/dashboard")
    } else if (userType === "user") {
      router.push("/user")
    }
    return null
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, type: "company" | "user") => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password, type)
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push(type === "company" ? "/company/dashboard" : "/user")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">CRM System</h1>
          <p className="text-muted-foreground text-pretty">Professional client relationship management platform</p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company Login
            </TabsTrigger>
            <TabsTrigger value="user" className="gap-2">
              <User className="h-4 w-4" />
              User Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Company Login</CardTitle>
                <CardDescription>Access your company dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, "company")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      name="email"
                      type="email"
                      placeholder="company@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Password</Label>
                    <Input id="company-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/register/company">Register Company</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>Access your personal dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, "user")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      name="email"
                      type="email"
                      placeholder="user@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input id="user-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
