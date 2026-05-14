import type { ApplicationStatus } from "@/lib/models/application.model"
import type { JobStatus } from "@/lib/models/job.model"
import type { UserRole, UserStatus } from "@/lib/models/user.model"

export const PAGE_SIZE_CARD = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE_CARD || "6", 10)
export const PAGE_SIZE_TABLE = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE_TABLE || "10", 10)

// Backend stores salary in raw units (e.g. 25000); the form displays/accepts in thousands (e.g. 25)
export const SALARY_UNIT = 1000

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  applied:   { color: "bg-blue-100 text-blue-800 border-blue-200",       label: "Applied" },
  screening: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Screening" },
  interview: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Interview" },
  offer:     { color: "bg-green-100 text-green-800 border-green-200",    label: "Offer" },
  rejected:  { color: "bg-red-100 text-red-800 border-red-200",          label: "Rejected" },
  declined:  { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Declined" },
}

export const NEXT_APPLICATION_STATUS: Record<ApplicationStatus, ApplicationStatus | null> = {
  applied:   "screening",
  screening: "interview",
  interview: "offer",
  offer:     null,
  rejected:  null,
  declined:  null,
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  draft:  "bg-gray-100 text-gray-800 border-gray-200",
  open:   "bg-green-100 text-green-800 border-green-200",
  closed: "bg-red-100 text-red-800 border-red-200",
}

export const USER_STATUS_CONFIG: Record<UserStatus, { color: string; label: string }> = {
  active:    { color: "bg-green-100 text-green-800 border-green-200", label: "Active" },
  suspended: { color: "bg-red-100 text-red-800 border-red-200",       label: "Suspended" },
}

export const USER_ROLE_CONFIG: Record<UserRole, { color: string; label: string }> = {
  head_admin: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "Head Admin" },
  admin:      { color: "bg-blue-100 text-blue-800 border-blue-200",       label: "Admin" },
}
