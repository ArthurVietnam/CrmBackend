"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Building2, CalendarCheck2, CheckCircle2, ShieldCheck, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"

const highlights = [
  { icon: Users2, title: "One customer view", text: "Keep clients, teams, and activity connected in one workspace." },
  { icon: CalendarCheck2, title: "Work stays on track", text: "Coordinate appointments, orders, and services without losing context." },
  { icon: BarChart3, title: "Decisions from data", text: "Turn operational activity into clear reports for your business." },
]

export default function HomePage() {
  const { isAuthenticated, userType, isLoading } = useAuth()
  const dashboardHref = userType === "company" ? "/company/dashboard" : "/user"

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="CRM System home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">CRM System</span>
          </Link>
          {!isLoading && (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button asChild>
                  <Link href={dashboardHref}>Open dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login">Log in</Link></Button>
                  <Button asChild><Link href="/register/company">Sign up <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm text-primary">
            <ShieldCheck className="h-4 w-4" /> Built for focused teams
          </div>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
            Run the work behind every great customer relationship.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            CRM System gives companies one calm place to manage clients, services, orders, appointments, and reports.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Button size="lg" asChild><Link href={dashboardHref}>Go to your dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            ) : (
              <>
                <Button size="lg" asChild><Link href="/register/company">Create a company account <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/login">Log in</Link></Button>
              </>
            )}
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Manage the details. Keep the momentum.</p>
        </div>

        <div className="relative rounded-3xl border border-border bg-card p-4 shadow-2xl shadow-primary/10">
          <div className="rounded-2xl border border-border/80 bg-background p-5">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div><p className="text-sm text-muted-foreground">Workspace overview</p><p className="mt-1 text-xl font-semibold">Good morning, team</p></div>
              <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">Live workspace</span>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-3">
              {["Clients", "Open orders", "Appointments"].map((label, index) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold">{["248", "36", "19"][index]}</p><p className="mt-1 text-xs text-primary">+{["12", "8", "4"][index]} this month</p></div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><p className="font-medium">Recent activity</p><span className="text-xs text-muted-foreground">Today</span></div><div className="mt-4 space-y-3">{["New client profile created", "Order moved to in progress", "Appointment confirmed"].map((item) => <div key={item} className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{item}</span></div>)}</div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-3 lg:px-8">
          {highlights.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 p-3"><Icon className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
        </div>
      </section>
    </main>
  )
}
