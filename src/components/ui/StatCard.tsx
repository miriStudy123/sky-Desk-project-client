import type { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  accent?: 'cyan' | 'violet'
}

export function StatCard({ icon: Icon, label, value, hint, accent = 'cyan' }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
        <span
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            accent === 'cyan' ? 'bg-cyan-glow/10 text-cyan-glow' : 'bg-violet-glow/10 text-violet-glow',
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-100">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  )
}
