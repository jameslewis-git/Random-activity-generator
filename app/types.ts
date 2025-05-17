import type { ReactNode } from "react"

export interface Activity {
  id: string
  name: string
  description: string
  category: string
  emoji: ReactNode
  custom?: boolean
} 