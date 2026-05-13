"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser, updateUser, suspendUser } from "@/lib/actions/user.action"
import { useAdminContext } from "@/contexts/admin-context"
import type { UserResponse, UserUpdate, UserRole } from "@/lib/models/user.model"

export function useUser(id: string) {
  const router = useRouter()
  const { currentUser } = useAdminContext()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuspending, setIsSuspending] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [editForm, setEditForm] = useState<UserUpdate>({})

  useEffect(() => {
    getUser(id)
      .then((data) => {
        setUser(data)
        setEditForm({ username: data.username, email: data.email, role: data.role })
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load user"))
      .finally(() => setIsLoading(false))
  }, [id])

  const isSelf = currentUser?.id === user?.id
  const canSuspend = !!user && user.status === "active" && user.role !== "head_admin" && !isSelf

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    setError(null)
    try {
      const patch: UserUpdate = {}
      if (editForm.username !== user.username) patch.username = editForm.username
      if (editForm.email !== user.email) patch.email = editForm.email
      if (!isSelf && editForm.role !== user.role) patch.role = editForm.role
      if (editForm.password) patch.password = editForm.password
      const updated = await updateUser(id, patch)
      setUser(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSuspend = async () => {
    setIsSuspending(true)
    try {
      await suspendUser(id)
      router.push("/admin/users")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend user")
      setIsSuspending(false)
    }
  }

  const cancelEdit = () => {
    if (!user) return
    setIsEditing(false)
    setEditForm({ username: user.username, email: user.email, role: user.role })
    setError(null)
  }

  const setField = (patch: Partial<UserUpdate>) =>
    setEditForm((prev) => ({ ...prev, ...patch }))

  return {
    user,
    isLoading,
    error,
    isEditing,
    isSaving,
    isSuspending,
    showSuspendModal,
    editForm,
    isSelf,
    canSuspend,
    setIsEditing,
    setShowSuspendModal,
    setField,
    handleSave,
    handleSuspend,
    cancelEdit,
  }
}
