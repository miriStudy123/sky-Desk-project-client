import axios, { type AxiosError } from 'axios'
import type { ApiProblem } from '../types'

const TOKEN_KEY = 'sky.auth.token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Normalized shape every caller can rely on, regardless of what the API sent back. */
export class ApiError extends Error {
  status: number
  correlationId?: string

  constructor(message: string, status: number, correlationId?: string) {
    super(message)
    this.status = status
    this.correlationId = correlationId
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblem>) => {
    const status = error.response?.status ?? 0
    const problem = error.response?.data
    const fieldErrors = problem?.errors ? Object.values(problem.errors).flat() : []
    const message =
      fieldErrors.join(' ') ||
      problem?.detail ||
      problem?.title ||
      (status === 0 ? 'Cannot reach the server. Is the API running?' : error.message)

    return Promise.reject(new ApiError(message, status, problem?.correlationId))
  },
)

let onUnauthorized: (() => void) | null = null
export const registerUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

api.interceptors.response.use(undefined, (error) => {
  if (error instanceof ApiError && error.status === 401) {
    onUnauthorized?.()
  }
  return Promise.reject(error)
})
