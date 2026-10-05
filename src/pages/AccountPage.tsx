import { LogOut, Mail, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function AccountPage() {
  const { user, logout } = useAuth()

  const initials = (user?.name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Account</h1>
        <p className="mt-1 text-sm text-ink-400">Your profile details.</p>
      </div>

      <div className="glow-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-xl font-bold text-base-950">
            {initials}
          </span>
          <div>
            <p className="text-lg font-semibold text-ink-100">{user?.name}</p>
            <span className="badge mt-1 border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
              <ShieldCheck className="h-3 w-3" />
              {user?.role}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-base-700/60 pt-5">
          <Field icon={User} label="Full name" value={user?.name ?? ''} />
          <Field icon={Mail} label="Email address" value={user?.email ?? ''} />
        </div>

        <button onClick={logout} className="btn-danger mt-6 w-full">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-base-700/60 bg-base-900/60 px-4 py-3">
      <Icon className="h-4 w-4 text-ink-500" />
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-100">{value}</p>
      </div>
    </div>
  )
}
