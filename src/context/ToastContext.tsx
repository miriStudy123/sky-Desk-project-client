import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  notify: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let nextId = 1

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const RING: Record<ToastKind, string> = {
  success: 'border-emerald-400/30 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)]',
  error: 'border-red-400/30 shadow-[0_0_24px_-6px_rgba(248,113,113,0.5)]',
  info: 'border-cyan-glow/30 shadow-glow',
}

const ICON_COLOR: Record<ToastKind, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-cyan-glow',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, kind, message }])
      window.setTimeout(() => remove(id), 4500)
    },
    [remove],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind]
          return (
            <div
              key={t.id}
              className={clsx(
                'glass-card pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 animate-fade-up',
                RING[t.kind],
              )}
            >
              <Icon className={clsx('mt-0.5 h-5 w-5 shrink-0', ICON_COLOR[t.kind])} />
              <p className="flex-1 text-sm text-ink-200">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-ink-500 hover:text-ink-200"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
