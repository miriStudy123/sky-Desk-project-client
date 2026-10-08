import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../lib/endpoints'
import { registerUnauthorizedHandler, tokenStore } from '../lib/api'
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types'

const USER_KEY = 'sky.auth.user'
const EXPIRES_KEY = 'sky.auth.expires'

interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  /** Why the user was signed out without asking (e.g. session expired). Shown on the sign-in page. */
  signOutReason: string | null
  login: (body: LoginRequest) => Promise<void>
  register: (body: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function clearStorage() {
  tokenStore.clear()
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

function readStoredUser(): UserResponse | null {
  const raw = localStorage.getItem(USER_KEY)
  const expires = Number(localStorage.getItem(EXPIRES_KEY))
  if (!raw || !tokenStore.get() || !expires || expires <= Date.now()) {
    clearStorage()
    return null
  }
  try {
    return JSON.parse(raw) as UserResponse
  } catch {
    clearStorage()
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => readStoredUser())
  const [isLoading, setIsLoading] = useState(false)
  const [signOutReason, setSignOutReason] = useState<string | null>(null)

  const persist = useCallback((res: AuthResponse) => {
    tokenStore.set(res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    localStorage.setItem(EXPIRES_KEY, String(new Date(res.expiresAtUtc).getTime()))
    setSignOutReason(null)
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    clearStorage()
    setSignOutReason(null)
    setUser(null)
  }, [])

  const expireSession = useCallback((reason: string) => {
    clearStorage()
    setSignOutReason(reason)
    setUser(null)
  }, [])

  useEffect(() => {
    registerUnauthorizedHandler(() => expireSession('Your session is no longer valid. Please sign in again.'))
  }, [expireSession])

  // Sign out automatically when the token's lifetime runs out, rather than failing on the next click.
  useEffect(() => {
    if (!user) return
    const msLeft = Number(localStorage.getItem(EXPIRES_KEY)) - Date.now()
    const timer = window.setTimeout(
      () => expireSession('Your session expired for security reasons. Please sign in again.'),
      Math.max(msLeft, 0),
    )
    return () => window.clearTimeout(timer)
  }, [user, expireSession])

  const login = useCallback(
    async (body: LoginRequest) => {
      setIsLoading(true)
      try {
        persist(await authApi.login(body))
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
        persist(await authApi.register(body))
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
      signOutReason,
      login,
      register,
      logout,
    }),
    [user, isLoading, signOutReason, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
