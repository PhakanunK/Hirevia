import type { JobType } from "../models/job.model"

export const formatJobType = (type: JobType) => {
  const types: Record<JobType, string> = {
    full_time: "Full Time",
    contract: "Contract",
    internship: "Internship",
  }
  return types[type]
}

export const formatSalary = (min: number, max?: number) => {
  const formatNumber = (num: number) => num.toLocaleString()
  if (max) return `฿${formatNumber(min)} - ฿${formatNumber(max)}`
  return `฿${formatNumber(min)}+`
}

export const formatSalaryCompact = (min: number, max?: number) => {
  const formatK = (num: number) => `฿${(num / 1000).toFixed(0)}K`
  if (max) return `${formatK(min)} - ${formatK(max)}`
  return `${formatK(min)}+`
}
