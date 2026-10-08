import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { ChevronDown, LayoutDashboard, LogOut, PlaneTakeoff, Search, Settings2, Ticket, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { resolveAirport } from '../lib/airports'

interface NavItem {
  to: string
  label: string
  /** One line telling people what they can do on that page. */
  description: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', description: 'Your trips at a glance', icon: LayoutDashboard, end: true },
  { to: '/flights', label: 'Book a flight', description: 'Search flights & pick a seat', icon: PlaneTakeoff },
  { to: '/bookings', label: 'My bookings', description: 'View or cancel your trips', icon: Ticket },
]

const ADMIN_NAV_ITEM: NavItem = {
  to: '/admin/flights',
  label: 'Manage flights',
  description: 'Admin: add, edit, delete flights',
  icon: Settings2,
}

const ACCOUNT_NAV_ITEM: NavItem = { to: '/account', label: 'Account', description: 'Your profile details', icon: UserRound }

export function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const resolution = resolveAirport(search)
    if (resolution.kind === 'code') {
      navigate(`/flights?origin=${encodeURIComponent(resolution.code)}`)
      return
    }
    if (resolution.kind !== 'empty') {
      notify(
        resolution.kind === 'ambiguous'
          ? 'That place has several airports – choose one in the "From" box.'
          : 'No airport found for that name. Try a country or city, e.g. Israel.',
        'info',
      )
    }
    navigate('/flights')
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    notify('You have been signed out.', 'info')
  }

  const initials = (user?.name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-cyan-glow px-4 py-2 font-semibold text-base-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-base-700/60 bg-base-900/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
            <PlaneTakeoff className="h-[18px] w-[18px] text-base-950" strokeWidth={2.4} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-ink-100">SkyDesk</p>
            <p className="text-[11px] leading-tight text-ink-400">Flight Booking</p>
          </div>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-base-700/60 pt-4">
          <SidebarLink item={ACCOUNT_NAV_ITEM} />
          <button onClick={handleLogout} className="sidebar-link w-full text-left hover:!text-red-300">
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-base-700/60 bg-base-950/80 px-5 py-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <PlaneTakeoff className="h-4 w-4 text-base-950" aria-hidden="true" />
            </div>
          </div>

          <form onSubmit={handleSearch} role="search" className="relative flex w-full max-w-md gap-2">
            <label htmlFor="quick-search" className="sr-only">
              Quick flight search by departure city
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
                aria-hidden="true"
              />
              <input
                id="quick-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Flying from… (country or city)"
                className="field-input pl-9"
              />
            </div>
            <button type="submit" className="btn-ghost hidden !px-3 sm:inline-flex">
              Search
            </button>
          </form>

          <div className="relative ml-auto">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`Account menu for ${user?.name ?? 'you'}`}
              className="flex items-center gap-2.5 rounded-xl border border-base-600/70 bg-base-800/60 py-1.5 pl-1.5 pr-2.5 hover:bg-base-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-base-950"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold leading-tight text-ink-100">{user?.name}</span>
                <span className="block text-[11px] leading-tight text-ink-400">
                  {isAdmin ? 'Administrator' : 'Traveler'}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-ink-400" aria-hidden="true" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  role="menu"
                  className="glass-card absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl p-1.5 animate-fade-up"
                >
                  <p className="truncate px-2.5 pb-2 pt-1 text-xs text-ink-400">
                    Signed in as <span className="text-ink-300">{user?.email}</span>
                  </p>
                  <button
                    role="menuitem"
                    autoFocus
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/account')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-300 hover:bg-base-700/60 hover:text-ink-100 focus:bg-base-700/60 focus:outline-none"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" /> My account
                  </button>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 px-5 py-6 pb-24 focus:outline-none lg:px-8 lg:py-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-base-700/60 px-5 pb-20 pt-3 text-center text-sm text-ink-500 lg:px-8 lg:pb-3">
          Created and Engineered by <span className="font-bold text-ink-300">Miri Roth</span>
        </footer>
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-base-700/60 bg-base-900/95 py-2 backdrop-blur-xl lg:hidden"
      >
        {[...items, ACCOUNT_NAV_ITEM].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-ink-400',
                isActive && 'text-cyan-glow',
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => clsx('sidebar-link !items-start', isActive && 'active')}>
      <item.icon className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span>
        <span className="block">{item.label}</span>
        <span className="block text-xs font-normal text-ink-500">{item.description}</span>
      </span>
    </NavLink>
  )
}
