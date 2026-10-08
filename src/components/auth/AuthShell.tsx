import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { Armchair, Clock3, PlaneTakeoff, Search } from 'lucide-react'

const BOOKING_FACTS = [
  { icon: Search, text: 'Search by departure and arrival airport, or by date' },
  { icon: Armchair, text: 'Pick your exact seat on a live seat map' },
  { icon: Clock3, text: 'Book up to 2 hours before departure, cancel anytime' },
]

/** Shared frame for sign-in / sign-up: the form, with a short note about the site underneath. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <main className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <PlaneTakeoff className="h-6 w-6 text-base-950" strokeWidth={2.4} aria-hidden="true" />
          </div>
          <p className="text-lg font-bold text-ink-100">SkyDesk</p>
        </div>

        <div className="glow-card rounded-2xl p-6 sm:p-7">
          <AuthTabs />
          <h1 className="mt-6 text-2xl font-bold text-ink-100">{title}</h1>
          <p className="mb-6 mt-1.5 text-sm text-ink-400">{subtitle}</p>
          {children}
        </div>

        <section aria-labelledby="about-skydesk" className="mt-8 px-1 text-center">
          <h2 id="about-skydesk" className="text-sm font-semibold text-ink-300">
            About SkyDesk
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-400">
            SkyDesk lets you find a flight, choose your seat and keep all your trips in one place. All you need
            is a free account.
          </p>
          <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left">
            {BOOKING_FACTS.map((fact) => (
              <li key={fact.text} className="flex items-center gap-2.5 text-sm text-ink-400">
                <fact.icon className="h-4 w-4 shrink-0 text-cyan-glow" aria-hidden="true" />
                {fact.text}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 border-t border-base-700/60 pt-5 text-center text-sm text-ink-500">
          Created and Engineered by <span className="font-bold text-ink-300">Miri Roth</span>
        </p>
      </main>
    </div>
  )
}

/** Makes it obvious which of the two forms you are on, and how to switch. */
function AuthTabs() {
  const tab = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60',
      isActive ? 'bg-base-700 text-ink-100 shadow-glow' : 'text-ink-400 hover:text-ink-100',
    )

  return (
    <nav aria-label="Sign in or create an account" className="flex gap-1 rounded-xl border border-base-600/70 bg-base-900/70 p-1">
      <NavLink to="/login" className={tab}>
        Sign in
      </NavLink>
      <NavLink to="/register" className={tab}>
        Create account
      </NavLink>
    </nav>
  )
}
