"use client"

import { useState, useEffect } from "react"
import { getApplication, updateApplicationStatus, updateInterviewDate } from "@/lib/actions/application.action"
import { getJob } from "@/lib/actions/job.action"
import { NEXT_APPLICATION_STATUS } from "@/lib/utils/constants"
import type { ApplicationResponse, ApplicationStatus } from "@/lib/models/application.model"

export function useApplication(id: string) {
  const [application, setApplication] = useState<ApplicationResponse | null>(null)
  const [jobTitle, setJobTitle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>("applied")
  const [scheduledInterviewDate, setScheduledInterviewDate] = useState<string | null>(null)

  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showEditInterviewModal, setShowEditInterviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null)
  const [interviewDateInput, setInterviewDateInput] = useState("")
  const [interviewTimeInput, setInterviewTimeInput] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getApplication(id)
        setApplication(data)
        setCurrentStatus(data.status)
        setScheduledInterviewDate(data.interview_date || null)
        try {
          const job = await getJob(data.job_id)
          setJobTitle(job.title)
        } catch { /* non-critical */ }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleUpdateStatus = async (newStatus: ApplicationStatus, interviewDate?: string) => {
    setIsUpdating(true)
    try {
      await updateApplicationStatus(id, {
        status: newStatus,
        ...(interviewDate && { interview_date: interviewDate }),
      })
      setCurrentStatus(newStatus)
      if (interviewDate) setScheduledInterviewDate(interviewDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateInterviewDate = async (interviewDate: string) => {
    setIsUpdating(true)
    try {
      await updateInterviewDate(id, { interview_date: interviewDate })
      setScheduledInterviewDate(interviewDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update interview date")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMoveToNextStage = () => {
    const next = NEXT_APPLICATION_STATUS[currentStatus]
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
      await handleUpdateStatus(pendingStatus)
      setPendingStatus(null)
    }
    setShowConfirmModal(false)
  }

  const confirmInterview = async () => {
    if (interviewDateInput && interviewTimeInput) {
      await handleUpdateStatus("interview", `${interviewDateInput}T${interviewTimeInput}:00`)
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
      await handleUpdateInterviewDate(`${interviewDateInput}T${interviewTimeInput}:00`)
      setShowEditInterviewModal(false)
      setInterviewDateInput("")
      setInterviewTimeInput("")
    }
  }

  const confirmReject = async () => {
    await handleUpdateStatus("rejected")
    setShowRejectModal(false)
  }

  return {
    application,
    jobTitle,
    isLoading,
    error,
    isUpdating,
    currentStatus,
    scheduledInterviewDate,
    nextStatus: NEXT_APPLICATION_STATUS[currentStatus],
    canReject: currentStatus !== "rejected" && currentStatus !== "offer",
    showInterviewModal, setShowInterviewModal,
    showEditInterviewModal, setShowEditInterviewModal,
    showConfirmModal, setShowConfirmModal,
    showRejectModal, setShowRejectModal,
    pendingStatus,
    interviewDateInput, setInterviewDateInput,
    interviewTimeInput, setInterviewTimeInput,
    handleMoveToNextStage,
    confirmStatusChange,
    confirmInterview,
    openEditInterviewModal,
    confirmEditInterview,
    confirmReject,
  }
}
