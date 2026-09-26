import { useState, type ReactNode } from 'react'
import type { LearningPreferences } from '../types/curriculum.types'
import { LearningContext } from './LearningContext'

export function LearningProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<LearningPreferences | null>(null)
  return <LearningContext.Provider value={{ preferences, setPreferences }}>{children}</LearningContext.Provider>
}
