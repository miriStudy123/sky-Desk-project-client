import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../lib/endpoints'
import { registerUnauthorizedHandler, tokenStore } from '../lib/api'
import type { LoginRequest, RegisterRequest, UserResponse } from '../types'

const USER_KEY = 'sky.auth.user'

interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (body: LoginRequest) => Promise<void>
  register: (body: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): UserResponse | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserResponse
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => readStoredUser())
  const [isLoading, setIsLoading] = useState(false)

  const persist = useCallback((token: string, nextUser: UserResponse) => {
    tokenStore.set(token)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    registerUnauthorizedHandler(() => logout())
  }, [logout])

  const login = useCallback(
    async (body: LoginRequest) => {
      setIsLoading(true)
      try {
        const res = await authApi.login(body)
        persist(res.token, res.user)
      } finally {
        setIsLoading(false)
      }
    },
    [persist],
  )

  const register = useCallback(
    async (body: RegisterRequest) => {
      setIsLoading(true)
      try {
        const res = await authApi.register(body)
        persist(res.token, res.user)
      } finally {
        setIsLoading(false)
      }
    },
    [persist],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'Admin',
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
