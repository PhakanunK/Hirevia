"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/hooks/use-dashboard"
import { Briefcase, AlertTriangle, FileText, CalendarDays, Users, CheckCircle, Clock, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
          {error}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
              <p className="text-3xl font-bold">{data.total_jobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-orange-100 p-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Urgent Jobs</p>
              <p className="text-3xl font-bold">{data.total_urgent_jobs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <p className="text-3xl font-bold">{data.total_applications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {data.upcoming_interviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Interview Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.upcoming_interviews.map((interview, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{interview.applicant_name}</TableCell>
                    <TableCell>{interview.job_title}</TableCell>
                    <TableCell>
                      {new Date(interview.interview_date).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-4 text-center text-muted-foreground">No upcoming interviews</p>
          )}
        </CardContent>
      </Card>

      {/* Latest Applications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Latest Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.latest_applications.length > 0 ? (
            data.latest_applications.map((application, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{application.job_title}</p>
                  <p className="text-sm text-muted-foreground">{application.applicant_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Applied: {new Date(application.applied_date).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href="/admin/applications">View All</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-muted-foreground">No recent applications</p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {[
              { icon: FileText, color: "blue", label: "Applied", value: data.summary.applied },
              { icon: Clock, color: "yellow", label: "Screening", value: data.summary.screening },
              { icon: CalendarDays, color: "purple", label: "Interview", value: data.summary.interview },
              { icon: CheckCircle, color: "green", label: "Offer", value: data.summary.offer },
              { icon: Users, color: "gray", label: "Rejected", value: data.summary.rejected },
            ].map(({ icon: Icon, color, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border p-4">
                <div className={`rounded-lg bg-${color}-100 p-2`}>
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
