import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LogIn, Mail, PlaneTakeoff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ApiError } from '../lib/api'
import { Spinner } from '../components/ui/Spinner'

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      notify('Welcome back! You are now signed in.', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your flights and bookings."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input pl-9"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field-input pl-9"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? <Spinner className="h-4 w-4 border-base-950/40 border-t-base-950" /> : <LogIn className="h-4 w-4" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        New to SkyDesk?{' '}
        <Link to="/register" className="font-semibold text-cyan-glow hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-base-600/60 bg-base-900/60 p-3.5 text-xs text-ink-500">
        <p className="mb-1 font-semibold text-ink-400">Demo accounts</p>
        <p>Admin — admin@flightbooking.local / Admin123!</p>
        <p>User — user@flightbooking.local / User123!</p>
      </div>
    </AuthShell>
  )
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <PlaneTakeoff className="h-6 w-6 text-base-950" strokeWidth={2.4} />
          </div>
          <h1 className="text-2xl font-bold text-ink-100">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>
        </div>

        <div className="glow-card rounded-2xl p-7">{children}</div>

        <p className="mt-8 text-center text-sm text-ink-500">
          Created and Engineered by <span className="font-bold text-ink-300">Miri Roth</span>
        </p>
      </div>
    </div>
  )
}
