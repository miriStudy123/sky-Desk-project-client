import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LockKeyhole, Mail, User, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ApiError } from '../lib/api'
import { Spinner } from '../components/ui/Spinner'
import { AuthShell } from '../components/auth/AuthShell'
import { FormAlert, FormField, RequirementList } from '../components/auth/FormField'

// Mirrors the rules in RegisterRequest.cs on the server.
const MIN_NAME = 2
const MIN_PASSWORD = 6
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const { register, isLoading } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState((location.state as { email?: string } | null)?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const errors = {
    name:
      name.trim().length < MIN_NAME ? `Enter your full name (at least ${MIN_NAME} characters).` : null,
    email: !email.trim()
      ? 'Enter your email address – you will use it to sign in.'
      : !EMAIL_PATTERN.test(email.trim())
        ? 'This doesn’t look like an email address (example: name@example.com).'
        : null,
    password: password.length < MIN_PASSWORD ? `Password must be at least ${MIN_PASSWORD} characters.` : null,
    confirm: !confirm ? 'Type your password again.' : confirm !== password ? 'The two passwords don’t match.' : null,
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)
    if (hasErrors) return

    try {
      await register({ name: name.trim(), email: email.trim(), password })
      notify('Your account is ready and you are signed in. Welcome aboard!', 'success')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const alreadyExists = !!error && /already exists/i.test(error)

  return (
    <AuthShell
      title="Create your account"
      subtitle="Fill in the 4 fields below. When you’re done you’ll be signed in automatically – no email confirmation needed."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Full name"
          icon={User}
          autoComplete="name"
          required
          autoFocus
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jane Doe"
          hint="Shown on your bookings and account page."
          error={submitted ? errors.name : null}
        />

        <FormField
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          required
          maxLength={256}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          hint="You’ll use this email to sign in."
          error={submitted ? errors.email : null}
        />

        <div>
          <FormField
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            required
            maxLength={100}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            error={submitted ? errors.password : null}
          />
          <RequirementList items={[{ label: `At least ${MIN_PASSWORD} characters`, met: password.length >= MIN_PASSWORD }]} />
        </div>

        <FormField
          label="Confirm password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          required
          maxLength={100}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type the same password again"
          error={submitted || (confirm.length >= password.length && confirm.length > 0) ? errors.confirm : null}
        />

        {submitted && hasErrors && !error && (
          <FormAlert>Please fix the highlighted fields above.</FormAlert>
        )}

        {error && (
          <FormAlert>
            <p>{error}</p>
            {alreadyExists && (
              <p>
                <Link to="/login" state={{ email }} className="font-semibold text-cyan-glow underline">
                  Sign in with this email instead →
                </Link>
              </p>
            )}
          </FormAlert>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3">
          {isLoading ? (
            <Spinner className="h-4 w-4 border-base-950/40 border-t-base-950" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoading ? 'Creating your account…' : 'Create account & sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-400">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-cyan-glow hover:underline">
          Sign in instead
        </Link>
      </p>
    </AuthShell>
  )
}
