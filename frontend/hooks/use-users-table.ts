"use client"

import { useState, useEffect, useCallback } from "react"
import { getUsers } from "@/lib/actions/user.action"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"
import type { UserResponse } from "@/lib/models/user.model"

export function useUsersTable() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getUsers({
        page: currentPage,
        page_size: PAGE_SIZE_TABLE,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      setUsers(data.data)
      setTotalPages(data.meta.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, roleFilter, statusFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const setRoleAndReset = (v: string) => { setRoleFilter(v); setCurrentPage(1) }
  const setStatusAndReset = (v: string) => { setStatusFilter(v); setCurrentPage(1) }

  return {
    users,
    isLoading,
    error,
    roleFilter,
    statusFilter,
    currentPage,
    totalPages,
    setRoleFilter: setRoleAndReset,
    setStatusFilter: setStatusAndReset,
    setCurrentPage,
    retry: fetchUsers,
  }
}
