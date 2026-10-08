import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ApiError } from '../lib/api'
import { Spinner } from '../components/ui/Spinner'
import { AuthShell } from '../components/auth/AuthShell'
import { FormAlert, FormField } from '../components/auth/FormField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LocationState {
  from?: { pathname: string }
  email?: string
}

export function LoginPage() {
  const { login, isLoading, signOutReason } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState | null) ?? {}

  const [email, setEmail] = useState(state.email ?? '')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const from = state.from?.pathname ?? '/'

  const emailError = !email.trim()
    ? 'Enter the email address you registered with.'
    : !EMAIL_PATTERN.test(email.trim())
      ? 'This doesn’t look like an email address (example: name@example.com).'
      : null
  const passwordError = !password ? 'Enter your password.' : null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)
    if (emailError || passwordError) return

    try {
      await login({ email: email.trim(), password })
      notify('Welcome back! You are now signed in.', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError('Something went wrong. Please try again.', 0))
    }
  }

  const notRegistered = error?.status === 401 && /not registered/i.test(error.message)

  return (
    <AuthShell title="Sign in" subtitle="Enter the email and password you used when you created your account.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {signOutReason && !error && <FormAlert kind="info">{signOutReason}</FormAlert>}

        <FormField
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          error={submitted ? emailError : null}
        />

        <FormField
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          error={submitted ? passwordError : null}
        />

        {error && (
          <FormAlert>
            <p>{error.message}</p>
            {notRegistered && (
              <p>
                <Link to="/register" state={{ email }} className="font-semibold text-cyan-glow underline">
                  Create an account with this email →
                </Link>
              </p>
            )}
          </FormAlert>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3">
          {isLoading ? (
            <Spinner className="h-4 w-4 border-base-950/40 border-t-base-950" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-400">
        Don’t have an account yet?{' '}
        <Link to="/register" className="font-semibold text-cyan-glow hover:underline">
          Create one – it’s free
        </Link>
      </p>

    </AuthShell>
  )
}
