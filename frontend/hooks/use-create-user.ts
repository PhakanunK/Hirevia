"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/user.action"
import type { UserCreate, UserRole } from "@/lib/models/user.model"

export function useCreateUser() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserCreate>({
    username: "",
    email: "",
    password: "",
    role: "admin",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (patch: Partial<UserCreate>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await createUser(formData)
      router.push("/admin/users")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin")
    } finally {
      setIsSubmitting(false)
    }
  }

  return { formData, set, isSubmitting, error, handleSubmit }
}
