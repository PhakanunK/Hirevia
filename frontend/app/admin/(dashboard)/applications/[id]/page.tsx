"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { adminFetch } from "@/lib/api"
import type { ApplicationResponse, ApplicationStatus, JobAdminResponse } from "@/lib/types"
import { Mail, Phone, FileText, Globe, Calendar, Loader2, AlertCircle } from "lucide-react"

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  applied: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Applied" },
  screening: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Screening" },
  interview: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Interview" },
  offer: { color: "bg-green-100 text-green-800 border-green-200", label: "Offer" },
  rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
}

const NEXT_STATUS: Record<ApplicationStatus, ApplicationStatus | null> = {
  applied: "screening",
  screening: "interview",
  interview: "offer",
  offer: null,
  rejected: null,
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [application, setApplication] = useState<ApplicationResponse | null>(null)
  const [jobTitle, setJobTitle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>("applied")
  const [scheduledInterviewDate, setScheduledInterviewDate] = useState<string | null>(null)
  const [interviewDateInput, setInterviewDateInput] = useState("")
  const [interviewTimeInput, setInterviewTimeInput] = useState("")

  // Modal states
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showEditInterviewModal, setShowEditInterviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null)

  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await adminFetch<ApplicationResponse>(`/applications/${id}`)
        setApplication(data)
        setCurrentStatus(data.status)
        setScheduledInterviewDate(data.interview_date || null)

        // job_title is not in ApplicationResponse — fetch separately
        try {
          const job = await adminFetch<JobAdminResponse>(`/jobs/${data.job_id}`)
          setJobTitle(job.title)
        } catch {
          // non-critical, falls back to job_id
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  const updateStatus = async (newStatus: ApplicationStatus, interviewDate?: string) => {
    setIsUpdating(true)
    try {
      await adminFetch(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          ...(interviewDate && { interview_date: interviewDate }),
        }),
      })
      setCurrentStatus(newStatus)
      if (interviewDate) setScheduledInterviewDate(interviewDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const updateInterviewDate = async (interviewDate: string) => {
    setIsUpdating(true)
    try {
      await adminFetch(`/applications/${id}/interview-date`, {
        method: 'PATCH',
        body: JSON.stringify({ interview_date: interviewDate }),
      })
      setScheduledInterviewDate(interviewDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update interview date')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Application not found</p>
      </div>
    )
  }

  const handleMoveToNextStage = () => {
    const next = NEXT_STATUS[currentStatus]
    if (!next) return

    if (next === "interview") {
      setShowInterviewModal(true)
    } else {
      setPendingStatus(next)
      setShowConfirmModal(true)
    }
  }

  const confirmStatusChange = async () => {
    if (pendingStatus) {
      await updateStatus(pendingStatus)
      setPendingStatus(null)
    }
    setShowConfirmModal(false)
  }

  const confirmInterview = async () => {
    if (interviewDateInput && interviewTimeInput) {
      const dateTime = `${interviewDateInput}T${interviewTimeInput}:00`
      await updateStatus("interview", dateTime)
      setShowInterviewModal(false)
      setInterviewDateInput("")
      setInterviewTimeInput("")
    }
  }

  const openEditInterviewModal = () => {
    if (scheduledInterviewDate) {
      const date = new Date(scheduledInterviewDate)
      setInterviewDateInput(date.toISOString().split("T")[0])
      setInterviewTimeInput(date.toTimeString().slice(0, 5))
    }
    setShowEditInterviewModal(true)
  }

  const confirmEditInterview = async () => {
    if (interviewDateInput && interviewTimeInput) {
      const dateTime = `${interviewDateInput}T${interviewTimeInput}:00`
      await updateInterviewDate(dateTime)
      setShowEditInterviewModal(false)
      setInterviewDateInput("")
      setInterviewTimeInput("")
    }
  }

  const confirmReject = async () => {
    await updateStatus("rejected")
    setShowRejectModal(false)
  }

  const nextStatus = NEXT_STATUS[currentStatus]
  const canReject = currentStatus !== "rejected" && currentStatus !== "offer"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Applications</h1>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">{jobTitle ?? `Job #${application.job_id}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={STATUS_CONFIG[currentStatus].color}>
                  {STATUS_CONFIG[currentStatus].label}
                </Badge>
              </div>

              {currentStatus === "interview" && scheduledInterviewDate && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-purple-50 p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      Interview scheduled:{" "}
                      {new Date(scheduledInterviewDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(scheduledInterviewDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openEditInterviewModal}
                    disabled={isUpdating}
                  >
                    Edit Time
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {application.first_name} {application.last_name}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{application.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{application.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Resume
                </a>
              </div>

              {application.portfolio_url && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Portfolio: {application.portfolio_url}
                  </a>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {nextStatus && (
                  <Button onClick={handleMoveToNextStage} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Move to {STATUS_CONFIG[nextStatus].label}
                  </Button>
                )}
                {canReject && (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowRejectModal(true)}
                    disabled={isUpdating}
                  >
                    Reject
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href={`/admin/jobs/${application.job_id}`}>View Job</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span>{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(application.updated_at).toLocaleDateString()}</span>
              </div>
              {scheduledInterviewDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interview</span>
                  <span>{new Date(scheduledInterviewDate).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`mailto:${application.email}`}>Send Email</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                  Download Resume
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Interview Schedule Modal */}
      <Dialog open={showEditInterviewModal} onOpenChange={setShowEditInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Interview Time</DialogTitle>
            <DialogDescription>
              Update the interview date and time for {application.first_name}{" "}
              {application.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-interview-date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit-interview-date"
                  type="date"
                  value={interviewDateInput}
                  onChange={(e) => setInterviewDateInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-interview-time">Time</Label>
              <Input
                id="edit-interview-time"
                type="time"
                value={interviewTimeInput}
                onChange={(e) => setInterviewTimeInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditInterviewModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmEditInterview} 
              disabled={!interviewDateInput || !interviewTimeInput || isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Schedule Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Select a date and time for the interview with {application.first_name}{" "}
              {application.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="interview-date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="interview-date"
                  type="date"
                  value={interviewDateInput}
                  onChange={(e) => setInterviewDateInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview-time">Time</Label>
              <Input
                id="interview-time"
                type="time"
                value={interviewTimeInput}
                onChange={(e) => setInterviewTimeInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmInterview} 
              disabled={!interviewDateInput || !interviewTimeInput || isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generic Confirm Modal */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this application to{" "}
              {pendingStatus ? STATUS_CONFIG[pendingStatus].label : ""}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirm Modal */}
      <AlertDialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
