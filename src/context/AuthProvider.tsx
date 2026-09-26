import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../api/authApi'
import type { AuthSession, LoginInput, RegisterInput, UserProfile } from '../types/auth.types'
import { tokenStorage } from '../utils/tokenStorage'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(Boolean(tokenStorage.get()))

  useEffect(() => {
    if (!tokenStorage.get()) return
    let active = true
    authApi.me().then((profile) => { if (active) setUser(profile) }).catch(() => {
      if (active) tokenStorage.clear()
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('geolingua:session-expired', expire)
    return () => window.removeEventListener('geolingua:session-expired', expire)
  }, [])

  const acceptSession = (session: AuthSession) => { tokenStorage.set(session.token); setUser(session.user) }
  const login = async (input: LoginInput) => {
    const session = await authApi.login(input)
    acceptSession(session)
    return session.user
  }
  const register = async (input: RegisterInput) => acceptSession(await authApi.register(input))
  const logout = async () => {
    try { await authApi.logout() }
    finally { tokenStorage.clear(); setUser(null) }
  }
  const refreshUser = useCallback(async () => setUser(await authApi.me()), [])

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>
}
