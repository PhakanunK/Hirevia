"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadResume, submitApplication } from "@/lib/actions/public.action"

export interface ApplyFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  resume: File | null
  portfolio: string
}

const DEFAULT_FORM: ApplyFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  resume: null,
  portfolio: "",
}

export function useApply(jobId: string) {
  const router = useRouter()
  const [formData, setFormData] = useState<ApplyFormData>(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStep, setSubmitStep] = useState<"uploading" | "submitting" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.resume) return
    setIsSubmitting(true)
    setError(null)
    try {
      setSubmitStep("uploading")
      const { url: resume_url } = await uploadResume(formData.resume)
      setSubmitStep("submitting")
      const res = await submitApplication({
        job_id: parseInt(jobId),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        resume_url,
        portfolio_url: formData.portfolio || undefined,
      })
      router.push(`/careers/${jobId}/apply/success?token=${res.tracking_token}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsSubmitting(false)
      setSubmitStep(null)
    }
  }

  return { formData, setFormData, isSubmitting, submitStep, error, handleSubmit }
}
