"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { publicFetch } from "@/lib/api"
import type { Application, ApplicationStatus } from "@/lib/types"
import { CheckCircle2, Circle, XCircle, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const statusSteps: { status: ApplicationStatus; label: string }[] = [
  { status: "applied", label: "Applied" },
  { status: "screening", label: "Screening" },
  { status: "interview", label: "Interview" },
  { status: "offer", label: "Offer" },
]

function getStepStatus(
  currentStatus: ApplicationStatus,
  stepStatus: ApplicationStatus
): "complete" | "current" | "pending" | "rejected" {
  const currentIndex = statusSteps.findIndex((s) => s.status === currentStatus)
  const stepIndex = statusSteps.findIndex((s) => s.status === stepStatus)

  if (currentStatus === "rejected") {
    if (stepIndex <= currentIndex) return "complete"
    return "rejected"
  }

  if (stepIndex < currentIndex) return "complete"
  if (stepIndex === currentIndex) return "current"
  return "pending"
}

function StatusStep({
  label,
  stepState,
}: {
  label: string
  stepState: "complete" | "current" | "pending" | "rejected"
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full border-2",
          stepState === "complete" && "border-primary bg-primary/10",
          stepState === "current" && "border-primary bg-primary text-primary-foreground",
          stepState === "pending" && "border-muted-foreground/30",
          stepState === "rejected" && "border-muted-foreground/30"
        )}
      >
        {stepState === "complete" && (
          <CheckCircle2 className="h-8 w-8 text-primary" />
        )}
        {stepState === "current" && <Circle className="h-8 w-8" />}
        {stepState === "pending" && (
          <Circle className="h-8 w-8 text-muted-foreground/30" />
        )}
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          stepState === "pending" && "text-muted-foreground/50"
        )}
      >
        {label}
      </span>
    </div>
  )
}

function RejectStep() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <span className="text-sm font-medium">Reject</span>
    </div>
  )
}

function StatusContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      fetchStatus()
    } else {
      setIsLoading(false)
      setError("No application token provided. Please check your email for the status link.")
    }
  }, [token])

  const fetchStatus = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await publicFetch<Application>('/status', {
        params: { token: token! }
      })
      setApplication(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application status')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-12 text-center text-3xl font-bold">Status</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-12 text-center text-3xl font-bold">Status</h1>
        <div className="py-12 text-center">
          <p className="mb-4 text-destructive">{error || 'Application not found'}</p>
          {token && <Button onClick={fetchStatus}>Try Again</Button>}
        </div>
      </div>
    )
  }

  const applicantName = application.first_name

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-12 text-center text-3xl font-bold">Status</h1>

      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-muted p-4">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-lg">Hi {applicantName},</p>
        <p className="mt-2 text-muted-foreground">
          {application.status === "rejected"
            ? "Unfortunately, we have decided not to move forward with your application."
            : application.status === "offer"
            ? "Congratulations! We would like to extend an offer to you."
            : "Your application has been received."}
        </p>
        <p className="text-muted-foreground">
          {application.status !== "rejected" &&
            application.status !== "offer" &&
            "We'll review it and get back to you soon."}
        </p>
      </div>

      {/* Status Pipeline */}
      <div className="flex items-start justify-center gap-4">
        {statusSteps.map((step, index) => (
          <div key={step.status} className="flex items-start">
            <StatusStep
              label={step.label}
              stepState={getStepStatus(application.status, step.status)}
            />
            {index < statusSteps.length - 1 && (
              <div className="mt-7 h-0.5 w-8 bg-muted-foreground/20" />
            )}
          </div>
        ))}
        <div className="h-0.5 w-8 mt-7 bg-muted-foreground/20" />
        <RejectStep />
      </div>
    </div>
  )
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>}>
      <StatusContent />
    </Suspense>
  )
}
