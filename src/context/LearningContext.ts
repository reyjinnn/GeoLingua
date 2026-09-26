import { createContext } from 'react'
import type { LearningPreferences } from '../types/curriculum.types'

export interface LearningContextValue { preferences: LearningPreferences | null; setPreferences: (value: LearningPreferences | null) => void }
export const LearningContext = createContext<LearningContextValue | null>(null)
