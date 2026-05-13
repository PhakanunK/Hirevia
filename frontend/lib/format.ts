import type { JobType } from "./types"

export const formatJobType = (type: JobType) => {
  const types: Record<JobType, string> = {
    full_time: "Full Time",
    contract: "Contract",
    internship: "Internship",
  }
  return types[type]
}

/**
 * Format salary display
 * - If max_salary exists: show "฿30,000 - ฿50,000"
 * - If no max_salary: show "฿30,000+"
 */
export const formatSalary = (min: number, max?: number) => {
  const formatNumber = (num: number) => num.toLocaleString()
  
  if (max) {
    return `฿${formatNumber(min)} - ฿${formatNumber(max)}`
  }
  return `฿${formatNumber(min)}+`
}

/**
 * Format salary in compact form (K)
 */
export const formatSalaryCompact = (min: number, max?: number) => {
  const formatK = (num: number) => `฿${(num / 1000).toFixed(0)}K`
  
  if (max) {
    return `${formatK(min)} - ${formatK(max)}`
  }
  return `${formatK(min)}+`
}
