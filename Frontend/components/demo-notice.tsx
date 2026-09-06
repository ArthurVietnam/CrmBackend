"use client"

import { AlertTriangle } from "lucide-react"

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 shadow-lg backdrop-blur" : "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100"}>
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
      <span>Demo environment: all data is wiped every 24 hours.</span>
    </div>
  )
}
