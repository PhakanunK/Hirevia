"use client"

import { createContext, useContext } from "react"
import type { UserResponse } from "@/lib/models/user.model"

interface AdminContextValue {
  currentUser: UserResponse | null
}

export const AdminContext = createContext<AdminContextValue>({ currentUser: null })

export const useAdminContext = () => useContext(AdminContext)
