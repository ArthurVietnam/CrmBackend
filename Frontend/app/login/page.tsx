"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import { DemoNotice } from "@/components/demo-notice"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, userType, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (!authLoading && isAuthenticated) {
    router.replace(userType === "company" ? "/company/dashboard" : "/user")
    return null
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>, type: "company" | "user") => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)

    try {
      await login(formData.get("email") as string, formData.get("password") as string, type)
      toast({ title: "Welcome back", description: "You are now signed in." })
      router.push(type === "company" ? "/company/dashboard" : "/user")
    } catch (error) {
      toast({ title: "Unable to sign in", description: error instanceof Error ? error.message : "Please check your credentials.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12"><DemoNotice compact /><div className="w-full max-w-md">
    <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></span><span className="text-lg font-semibold">CRM System</span></Link>
    <Card><CardHeader><CardTitle className="text-2xl">Welcome back</CardTitle><CardDescription>Sign in to continue to your workspace.</CardDescription><div className="mt-4"><DemoNotice /></div></CardHeader><CardContent><Tabs defaultValue="company"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="company" className="gap-2"><Building2 className="h-4 w-4" />Company</TabsTrigger><TabsTrigger value="user" className="gap-2"><User className="h-4 w-4" />User</TabsTrigger></TabsList>
      {(["company", "user"] as const).map((type) => <TabsContent key={type} value={type}><form onSubmit={(event) => handleLogin(event, type)} className="space-y-4 pt-4"><div className="space-y-2"><Label htmlFor={`${type}-email`}>Email</Label><Input id={`${type}-email`} name="email" type="email" placeholder="you@example.com" required disabled={isLoading} /></div><div className="space-y-2"><Label htmlFor={`${type}-password`}>Password</Label><Input id={`${type}-password`} name="password" type="password" required disabled={isLoading} /></div><Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Log in"}</Button>{type === "company" && <p className="text-center text-sm text-muted-foreground">New company? <Link href="/register/company" className="font-medium text-primary hover:underline">Create an account</Link></p>}</form></TabsContent>)}
    </Tabs></CardContent></Card><p className="mt-6 text-center text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground">Back to home</Link></p>
  </div></main>
}
