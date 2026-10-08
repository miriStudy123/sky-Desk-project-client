import { useId, useState, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { AlertCircle, Check, Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  icon: LucideIcon
  /** Always-visible guidance under the field (what to type, why it's needed). */
  hint?: string
  /** Validation message; replaces the hint and marks the field invalid. */
  error?: string | null
}

/** Labelled input with icon, helper text and inline error, wired up for screen readers. */
export function FormField({ label, icon: Icon, hint, error, className, type = 'text', ...input }: FormFieldProps) {
  const id = useId()
  const describedBy = `${id}-desc`
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {input.required && (
          <span className="ml-1 text-cyan-glow" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          aria-hidden="true"
        />
        <input
          id={id}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={hint || error ? describedBy : undefined}
          className={clsx(
            'field-input pl-9',
            isPassword && 'pr-11',
            error && '!border-red-400/70 focus:!ring-red-400/40',
            className,
          )}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 hover:text-ink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            title={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={describedBy} className="mt-1.5 flex items-start gap-1.5 text-xs text-red-300">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={describedBy} className="mt-1.5 text-xs text-ink-400">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

/** Live checklist so people know the rules before they hit "submit", not after. */
export function RequirementList({ items }: { items: { label: string; met: boolean }[] }) {
  return (
    <ul className="mt-2 space-y-1" aria-label="Password requirements">
      {items.map((item) => (
        <li
          key={item.label}
          className={clsx('flex items-center gap-1.5 text-xs', item.met ? 'text-emerald-300' : 'text-ink-400')}
        >
          <span
            className={clsx(
              'flex h-3.5 w-3.5 items-center justify-center rounded-full border',
              item.met ? 'border-emerald-400 bg-emerald-400/20' : 'border-ink-500',
            )}
            aria-hidden="true"
          >
            {item.met && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
          </span>
          {item.label}
          <span className="sr-only">{item.met ? '(done)' : '(not yet)'}</span>
        </li>
      ))}
    </ul>
  )
}

export function FormAlert({ kind = 'error', children }: { kind?: 'error' | 'info'; children: React.ReactNode }) {
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm',
        kind === 'error'
          ? 'border-red-500/30 bg-red-500/10 text-red-200'
          : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="space-y-1">{children}</div>
    </div>
  )
}
