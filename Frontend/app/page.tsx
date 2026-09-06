"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Building2, CalendarCheck2, Check, ShieldCheck, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { DemoNotice } from "@/components/demo-notice"

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
      <DemoNotice compact />
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
            CRM System gives growing companies one calm place to manage clients, services, orders, appointments, and reports. Keep your team aligned, your customer history accessible, and your daily operations moving without unnecessary complexity.
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

      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Simple plan</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Everything your company needs to stay organized.</h2>
            <p className="mt-5 max-w-lg text-pretty leading-7 text-muted-foreground">Start without a complicated setup. The Basic plan gives your company a complete operational workspace, with a short trial so you can see how it fits your team before paying.</p>
          </div>
          <div className="rounded-3xl border border-primary/40 bg-card p-7 shadow-xl shadow-primary/10 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xl font-semibold">Basic</p><p className="mt-1 text-sm text-muted-foreground">For small and growing teams</p></div>
              <div className="text-right"><p className="text-4xl font-semibold tracking-tight">$2.99</p><p className="text-sm text-muted-foreground">per month</p></div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["7-day free trial at registration", "Up to 5 employee accounts", "5 users or devices for your team", "Unlimited clients, services, orders, appointments, and reports"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></div>)}
            </div>
            <Button className="mt-8 w-full" size="lg" asChild><Link href={isAuthenticated ? "/company/dashboard" : "/register/company"}>Start your 7-day trial <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">One company account includes five worker accounts. Everything else is unlimited.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-3 lg:px-8">
          {highlights.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 p-3"><Icon className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p>© 2026 MyCRM. All rights reserved.</p>
            <a className="mt-1 inline-block transition-colors hover:text-foreground" href="mailto:gera.gde.dom@list.ru">gera.gde.dom@list.ru</a>
          </div>
          <p>Created by <a className="text-foreground underline underline-offset-4 transition-colors hover:text-primary" href="https://www.linkedin.com/in/%D0%B0%D1%80%D1%82%D1%83%D1%80-%D0%BC%D1%83%D0%BD%D1%82%D1%8F%D0%BD-208ab4341" target="_blank" rel="noreferrer">Артур Мунтян</a></p>
        </div>
      </footer>
    </main>
  )
}
