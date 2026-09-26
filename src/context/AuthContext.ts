import { createContext } from 'react'
import type { LoginInput, RegisterInput, UserProfile } from '../types/auth.types'

export interface AuthContextValue {
  user: UserProfile | null
  loading: boolean
  login: (input: LoginInput) => Promise<UserProfile>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
export const AuthContext = createContext<AuthContextValue | null>(null)
