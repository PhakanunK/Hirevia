import type { ApplicationStatus, JobStatus } from "./types"

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  applied:   { color: "bg-blue-100 text-blue-800 border-blue-200",   label: "Applied" },
  screening: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Screening" },
  interview: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Interview" },
  offer:     { color: "bg-green-100 text-green-800 border-green-200",  label: "Offer" },
  rejected:  { color: "bg-red-100 text-red-800 border-red-200",      label: "Rejected" },
}

export const NEXT_APPLICATION_STATUS: Record<ApplicationStatus, ApplicationStatus | null> = {
  applied:   "screening",
  screening: "interview",
  interview: "offer",
  offer:     null,
  rejected:  null,
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  draft:  "bg-gray-100 text-gray-800 border-gray-200",
  open:   "bg-green-100 text-green-800 border-green-200",
  closed: "bg-red-100 text-red-800 border-red-200",
}
