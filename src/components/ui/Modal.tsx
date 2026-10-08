import { useEffect, useId, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  width?: string
}

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-3xl' }: ModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-base-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`glow-card relative w-full ${width} max-h-[88vh] overflow-y-auto rounded-2xl p-6 animate-fade-up`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink-100">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            autoFocus
            className="rounded-lg border border-base-600/70 bg-base-800/70 p-1.5 text-ink-400 hover:text-ink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
