"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { LLMConfig } from "./llm"

export type ProjectType = "LANDING_PAGE" | "WEBSITE"
export type ProjectStatus = "DRAFT" | "GENERATING" | "READY" | "FAILED"
export type PlanType = "FREE" | "STARTER" | "PRO" | "AGENCY"

export interface Project {
  id: string
  name: string
  type: ProjectType
  prompt: string
  status: ProjectStatus
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  password?: string
  image?: string
  plan: PlanType
  apiKeys: string[]
  projects: Project[]
  joinedAt: string
  provider: "google" | "email"
}

export interface AdminStats {
  totalUsers: number
  totalProjects: number
  planDistribution: Record<PlanType, number>
  recentUsers: User[]
}

const isBrowser = typeof window !== "undefined"

interface AppState {
  user: User | null
  users: User[]
  llmConfig: LLMConfig | null
  setUser: (user: User | null) => void
  addUser: (user: User) => void
  addProject: (project: Project) => void
  addApiKey: (key: string) => void
  removeApiKey: (key: string) => void
  updatePlan: (userId: string, plan: PlanType) => void
  setLLMConfig: (config: LLMConfig | null) => void
  getAdminStats: () => AdminStats
}

const demoUsers: User[] = [
  { id: "admin-1", name: "Admin", email: "bhat84617@gmail.com", password: "admin123", plan: "AGENCY", apiKeys: [], projects: [], joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(), provider: "email" },
  { id: "user-1", name: "Rahul Sharma", email: "rahul@example.com", password: "user123", plan: "PRO", apiKeys: ["sk-pro-xxx"], projects: [
    { id: "p1", name: "SaaS Landing", type: "LANDING_PAGE", prompt: "Modern SaaS landing page for a startup", status: "READY", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "p1-b", name: "Ebook Sales", type: "LANDING_PAGE", prompt: "Sales page for a digital ebook", status: "READY", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  ], joinedAt: new Date(Date.now() - 86400000 * 14).toISOString(), provider: "email" },
  { id: "user-2", name: "Priya Patel", email: "priya@example.com", password: "user123", plan: "FREE", apiKeys: [], projects: [
    { id: "p2", name: "Portfolio", type: "LANDING_PAGE", prompt: "Creative portfolio for a designer", status: "DRAFT", createdAt: new Date().toISOString() },
  ], joinedAt: new Date(Date.now() - 86400000 * 7).toISOString(), provider: "email" },
  { id: "user-3", name: "Amit Kumar", email: "amit@example.com", password: "user123", plan: "STARTER", apiKeys: [], projects: [
    { id: "p3", name: "Fitness App", type: "WEBSITE", prompt: "Landing page for a fitness tracking app", status: "READY", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  ], joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(), provider: "google" },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      users: demoUsers,
      llmConfig: null,

      setUser: (user) => set({ user }),

      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),

      addProject: (project) => set((state) => {
        const updatedUsers = state.users.map((u) =>
          u.id === state.user?.id ? { ...u, projects: [project, ...u.projects] } : u
        )
        const updatedUser = state.user ? { ...state.user, projects: [project, ...state.user.projects] } : null
        return { users: updatedUsers, user: updatedUser }
      }),

      addApiKey: (key) => set((state) => {
        if (!state.user) return state
        const updatedUser = { ...state.user, apiKeys: [...state.user.apiKeys, key] }
        const updatedUsers = state.users.map((u) => u.id === state.user!.id ? updatedUser : u)
        return { user: updatedUser, users: updatedUsers }
      }),

      removeApiKey: (key) => set((state) => {
        if (!state.user) return state
        const updatedUser = { ...state.user, apiKeys: state.user.apiKeys.filter((k) => k !== key) }
        const updatedUsers = state.users.map((u) => u.id === state.user!.id ? updatedUser : u)
        return { user: updatedUser, users: updatedUsers }
      }),

      setLLMConfig: (config) => set({ llmConfig: config }),

      updatePlan: (userId, plan) => set((state) => {
        const updatedUsers = state.users.map((u) => u.id === userId ? { ...u, plan } : u)
        const updatedUser = state.user?.id === userId ? { ...state.user, plan } : state.user
        return { users: updatedUsers, user: updatedUser }
      }),

      getAdminStats: () => {
        const state = get()
        const planDistribution = { FREE: 0, STARTER: 0, PRO: 0, AGENCY: 0 }
        state.users.forEach((u) => planDistribution[u.plan]++)
        const totalProjects = state.users.reduce((acc, u) => acc + u.projects.length, 0)
        return {
          totalUsers: state.users.length,
          totalProjects,
          planDistribution,
          recentUsers: state.users.slice(0, 10),
        }
      },
    }),
    {
      name: "buildai-store",
      storage: isBrowser ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
