import { clsx } from 'clsx'

const STYLES: Record<string, string> = {
  Confirmed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-red-500/10 text-red-300 border-red-500/30',
  Available: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Held: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Booked: 'bg-violet-glow/10 text-violet-glow border-violet-glow/30',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('badge', STYLES[status] ?? 'bg-base-700/50 text-ink-300 border-base-600')}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
