import { apiClient } from './apiClient'
import type { AuthSession, LoginInput, RegisterInput, UserProfile } from '../types/auth.types'

export const authApi = {
  register: (input: RegisterInput) => apiClient<AuthSession>('/auth/register', { method: 'POST', body: input }),
  login: (input: LoginInput) => apiClient<AuthSession>('/auth/login', { method: 'POST', body: input }),
  logout: () => apiClient<{ message: string }>('/auth/logout', { method: 'POST' }),
  me: () => apiClient<UserProfile>('/auth/me'),
}
