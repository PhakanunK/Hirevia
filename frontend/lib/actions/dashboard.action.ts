import { adminFetch } from "@/lib/api"
import type { DashboardResponse } from "@/lib/models/dashboard.model"

export const getDashboard = () => adminFetch<DashboardResponse>("/dashboard")
