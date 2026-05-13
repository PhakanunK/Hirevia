import { adminFetch } from "@/lib/api"
import type { DashboardResponse } from "@/lib/models/user.model"

export const getDashboard = () => adminFetch<DashboardResponse>("/dashboard")
