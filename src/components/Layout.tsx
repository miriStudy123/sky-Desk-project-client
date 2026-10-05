import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Bell,
  LayoutDashboard,
  LogOut,
  PlaneTakeoff,
  Search,
  Settings2,
  Ticket,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/flights', label: 'Flights', icon: PlaneTakeoff },
  { to: '/bookings', label: 'My Bookings', icon: Ticket },
]

const ADMIN_NAV_ITEM = { to: '/admin/flights', label: 'Manage Flights', icon: Settings2, end: false }

export function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = search.trim()
    navigate(trimmed ? `/flights?origin=${encodeURIComponent(trimmed)}` : '/flights')
  }

  const initials = (user?.name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-base-700/60 bg-base-900/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
            <PlaneTakeoff className="h-4.5 w-4.5 text-base-950" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-ink-100">SkyDesk</p>
            <p className="text-[11px] leading-tight text-ink-500">Flight Booking</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-base-700/60 pt-4">
          <NavLink to="/account" className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
            <UserRound className="h-[18px] w-[18px]" />
            Account
          </NavLink>
          <button onClick={logout} className="sidebar-link w-full text-left hover:!text-red-300">
            <LogOut className="h-[18px] w-[18px]" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-base-700/60 bg-base-950/80 px-5 py-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <PlaneTakeoff className="h-4 w-4 text-base-950" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by origin city…"
              className="field-input pl-9"
            />
          </form>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative rounded-xl border border-base-600/70 bg-base-800/60 p-2.5 text-ink-400 hover:text-ink-100"
              aria-label="Notifications"
              onClick={() => setMenuOpen(false)}
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-glow" />
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-xl border border-base-600/70 bg-base-800/60 py-1.5 pl-1.5 pr-3 hover:bg-base-700/60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-base-950">
                  {initials}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold leading-tight text-ink-100">{user?.name}</span>
                  <span className="block text-[11px] leading-tight text-ink-500">{user?.role}</span>
                </span>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="glass-card absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl p-1.5 animate-fade-up">
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        navigate('/account')
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-300 hover:bg-base-700/60 hover:text-ink-100"
                    >
                      <UserRound className="h-4 w-4" /> Account
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-base-700/60 px-5 pb-20 pt-3 text-center text-sm text-ink-500 lg:px-8 lg:pb-3">
          Created and Engineered by <span className="font-bold text-ink-300">Miri Roth</span>
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-base-700/60 bg-base-900/95 py-2 backdrop-blur-xl lg:hidden">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium text-ink-500',
                isActive && 'text-cyan-glow',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
