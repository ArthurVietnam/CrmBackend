"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { reportsApi } from "@/lib/api/reports"
import { useToast } from "@/hooks/use-toast"
import { Download, FileSpreadsheet } from "lucide-react"

export default function ReportsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDownloading(true)

    try {
      const blob = await reportsApi.downloadMonthlyReport(month, year)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Report_${month.toString().padStart(2, "0")}_${year}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      })
    } catch (error) {
      console.error("Failed to download report:", error)
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Reports</h1>
        <p className="text-muted-foreground text-pretty">Download monthly Excel reports</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Monthly Report
          </CardTitle>
          <CardDescription>Select month and year to download Excel report</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDownloadReport} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  disabled={isDownloading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  disabled={isDownloading}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isDownloading} className="w-full">
              {isDownloading ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-pulse" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Monthly reports include:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Total revenue and orders for the selected month</li>
            <li>Client statistics and activity</li>
            <li>Service performance breakdown</li>
            <li>Appointment summaries</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
