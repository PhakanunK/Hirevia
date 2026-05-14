"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
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
import { PageLoader, PageError } from "@/components/ui/page-states"
import { useApplication } from "@/hooks/use-application"
import { APPLICATION_STATUS_CONFIG } from "@/lib/utils/constants"
import { getResumeViewerUrl, getResumeDownloadUrl } from "@/lib/utils/file.utils"
import type { ApplicationStatus } from "@/lib/models/application.model"
import { Mail, Phone, FileText, Globe, Calendar, Loader2, AlertCircle } from "lucide-react"

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    application, jobTitle, isLoading, error, isUpdating,
    currentStatus, scheduledInterviewDate, nextStatus, canReject, canDecline,
    showInterviewModal, setShowInterviewModal,
    showEditInterviewModal, setShowEditInterviewModal,
    showConfirmModal, setShowConfirmModal,
    showRejectModal, setShowRejectModal,
    showDeclineModal, setShowDeclineModal,
    pendingStatus,
    interviewDateInput, setInterviewDateInput,
    interviewTimeInput, setInterviewTimeInput,
    handleMoveToNextStage, confirmStatusChange, confirmInterview,
    openEditInterviewModal, confirmEditInterview, confirmReject, confirmDecline,
  } = useApplication(id)

  if (isLoading) return <PageLoader />
  if (error && !application) return (
    <PageError message={error} action={{ label: "Retry", onClick: () => window.location.reload() }} />
  )
  if (!application) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground">Application not found</p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Applications</h1>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mr-2 inline h-4 w-4" />{error}
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
                <Badge className={APPLICATION_STATUS_CONFIG[currentStatus].color}>
                  {APPLICATION_STATUS_CONFIG[currentStatus].label}
                </Badge>
              </div>

              {currentStatus === "interview" && scheduledInterviewDate && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-purple-50 p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      Interview scheduled:{" "}
                      {new Date(scheduledInterviewDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{" "}
                      at {new Date(scheduledInterviewDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openEditInterviewModal} disabled={isUpdating}>
                    Edit Time
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-lg font-medium">{application.first_name} {application.last_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /><span>{application.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /><span>{application.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a href={getResumeViewerUrl(application.resume_url)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View Resume
                </a>
              </div>

              {application.portfolio_url && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">
                    Portfolio: {application.portfolio_url}
                  </a>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {nextStatus && (
                  <Button onClick={handleMoveToNextStage} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Move to {APPLICATION_STATUS_CONFIG[nextStatus as ApplicationStatus].label}
                  </Button>
                )}
                {canReject && (
                  <Button variant="destructive" onClick={() => setShowRejectModal(true)} disabled={isUpdating}>
                    Reject
                  </Button>
                )}
                {canDecline && (
                  <Button variant="destructive" onClick={() => setShowDeclineModal(true)} disabled={isUpdating}>
                    Declined by Applicant
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link href={`/admin/jobs/${application.job_id}`}>View Job</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
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
                <a href={getResumeDownloadUrl(application.resume_url, application.first_name, application.last_name)} target="_blank" rel="noopener noreferrer">
                  Download Resume
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Interview Modal */}
      <Dialog open={showEditInterviewModal} onOpenChange={setShowEditInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Interview Time</DialogTitle>
            <DialogDescription>Update the interview date and time for {application.first_name} {application.last_name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-interview-date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="edit-interview-date" type="date" value={interviewDateInput} onChange={(e) => setInterviewDateInput(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-interview-time">Time</Label>
              <Input id="edit-interview-time" type="time" value={interviewTimeInput} onChange={(e) => setInterviewTimeInput(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditInterviewModal(false)}>Cancel</Button>
            <Button onClick={confirmEditInterview} disabled={!interviewDateInput || !interviewTimeInput || isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>Select a date and time for the interview with {application.first_name} {application.last_name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="interview-date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="interview-date" type="date" value={interviewDateInput} onChange={(e) => setInterviewDateInput(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview-time">Time</Label>
              <Input id="interview-time" type="time" value={interviewTimeInput} onChange={(e) => setInterviewTimeInput(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewModal(false)}>Cancel</Button>
            <Button onClick={confirmInterview} disabled={!interviewDateInput || !interviewTimeInput || isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Status Change */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this application to{" "}
              {pendingStatus ? APPLICATION_STATUS_CONFIG[pendingStatus].label : ""}?
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

      {/* Reject Modal */}
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

      {/* Decline Modal */}
      <AlertDialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Declined</AlertDialogTitle>
            <AlertDialogDescription>
              The applicant has declined the offer. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDecline}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
