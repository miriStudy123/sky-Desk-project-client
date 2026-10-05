import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-800 text-cyan-glow">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="text-3xl font-bold text-ink-100">Lost in the sky</h1>
      <p className="max-w-sm text-sm text-ink-400">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-2">
        Back to dashboard
      </Link>
    </div>
  )
}
