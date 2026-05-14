"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useApplicationStatus } from "@/hooks/use-application-status"
import type { ApplicationStatus } from "@/lib/models/application.model"
import {
  CheckCircle2, CheckCircle, XCircle, User, Loader2,
  FileText, Clock, CalendarDays, UserX, Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ActiveStatus = Exclude<ApplicationStatus, "rejected">

const STEPS: ActiveStatus[] = ["applied", "screening", "interview", "offer"]

const STEP_CONFIG: Record<ActiveStatus, {
  label: string
  Icon: React.ComponentType<{ className?: string }>
}> = {
  applied:   { label: "Applied",   Icon: FileText    },
  screening: { label: "Screening", Icon: Clock       },
  interview: { label: "Interview", Icon: CalendarDays },
  offer:     { label: "Offer",     Icon: CheckCircle },
}

const STATUS_MESSAGE: Record<ApplicationStatus, string> = {
  applied:   "We've received your application. Our team will review it shortly.",
  screening: "Your application passed the initial review and is now being screened by our team.",
  interview: "Great news! You've been selected for an interview. Check your email for details.",
  offer:     "Congratulations! We'd like to extend an offer to you. Our team will be in touch soon.",
  rejected:  "Thank you for your interest. Unfortunately, we've decided not to move forward with your application at this time.",
}

function getStepState(
  currentStatus: ApplicationStatus,
  step: ActiveStatus,
): "complete" | "current" | "pending" {
  if (currentStatus === "rejected") return "pending"
  const currentIdx = STEPS.indexOf(currentStatus as ActiveStatus)
  const stepIdx = STEPS.indexOf(step)
  if (stepIdx < currentIdx) return "complete"
  if (stepIdx === currentIdx) return "current"
  return "pending"
}

function StatusStep({ step, state }: { step: ActiveStatus; state: "complete" | "current" | "pending" }) {
  const { Icon, label } = STEP_CONFIG[step]
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors",
        state === "complete" && "border-primary bg-primary/10",
        state === "current"  && "border-primary bg-primary",
        state === "pending"  && "border-muted-foreground/30",
      )}>
        {state === "complete"
          ? <CheckCircle2 className="h-8 w-8 text-primary" />
          : <Icon className={cn("h-8 w-8", state === "current" ? "text-primary-foreground" : "text-muted-foreground/30")} />
        }
      </div>
      <span className={cn(
        "text-sm font-medium",
        state === "pending" && "text-muted-foreground/40",
        state === "current" && "font-semibold",
      )}>
        {label}
      </span>
    </div>
  )
}

function StatusContent() {
  const token = useSearchParams().get("token")
  const { application, isLoading, error, retry } = useApplicationStatus(token)

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-12 text-center text-3xl font-bold">Application Status</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-12 text-center text-3xl font-bold">Application Status</h1>
        <div className="py-12 text-center">
          <p className="mb-4 text-destructive">{error || "Application not found"}</p>
          {token && <Button onClick={retry}>Try Again</Button>}
        </div>
      </div>
    )
  }

  const isRejected = application.status === "rejected"

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-12 text-center text-3xl font-bold">Application Status</h1>

      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-muted p-4">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-lg font-medium">Hi {application.first_name},</p>
        <p className="mt-2 text-muted-foreground">{STATUS_MESSAGE[application.status]}</p>
      </div>

      <div className="flex items-start justify-center">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-start">
            <StatusStep step={step} state={getStepState(application.status, step)} />
            {index < STEPS.length - 1 && (
              <div className="mt-8 h-0.5 w-8 bg-muted-foreground/20" />
            )}
          </div>
        ))}
        {isRejected && (
          <>
            <div className="mt-8 h-0.5 w-8 bg-muted-foreground/20" />
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10">
                <UserX className="h-8 w-8 text-destructive" />
              </div>
              <span className="text-sm font-medium">Rejected</span>
            </div>
          </>
        )}
      </div>

      {application.status === "interview" && application.interview_date && (
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <Calendar className="h-5 w-5 shrink-0 text-purple-600" />
          <div>
            <p className="text-sm font-semibold text-purple-900">Interview Scheduled</p>
            <p className="text-sm text-purple-700">
              {new Date(application.interview_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(application.interview_date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <StatusContent />
    </Suspense>
  )
}
