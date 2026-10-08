import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Armchair, CalendarClock, PlaneTakeoff, Search, Ticket, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bookingsApi, flightsApi } from '../lib/endpoints'
import type { BookingResponse, FlightResponse } from '../types'
import { StatCard } from '../components/ui/StatCard'
import { PageSpinner } from '../components/ui/Spinner'
import { FlightCard } from '../components/FlightCard'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDateTime } from '../lib/format'

export function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<BookingResponse[] | null>(null)
  const [flights, setFlights] = useState<FlightResponse[] | null>(null)
  const [totalFlights, setTotalFlights] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([bookingsApi.mine(1, 50), flightsApi.search({ page: 1, pageSize: 6 })])
      .then(([b, f]) => {
        if (cancelled) return
        setBookings(b.items)
        setFlights(f.items)
        setTotalFlights(f.totalCount)
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const items = bookings ?? []
    const now = Date.now()
    const upcoming = items.filter((b) => b.status === 'Confirmed' && new Date(b.departureTime).getTime() > now)
    return {
      total: items.length,
      upcoming: upcoming.length,
      next: [...upcoming].sort((a, b) => +new Date(a.departureTime) - +new Date(b.departureTime)).slice(0, 3),
    }
  }, [bookings])

  const trend = useMemo(() => buildMonthlyTrend(bookings ?? []), [bookings])

  if (isLoading) return <PageSpinner label="Loading your dashboard…" />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-ink-400">Here's what's happening with your travel.</p>
        </div>
        <Link to="/flights" className="btn-primary">
          <Search className="h-4 w-4" aria-hidden="true" />
          Book a flight
        </Link>
      </div>

      {stats.total === 0 && <GettingStarted />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Ticket} label="Upcoming trips" value={String(stats.upcoming)} hint="Confirmed & scheduled" />
        <StatCard icon={CalendarClock} label="Total bookings" value={String(stats.total)} hint="All time" accent="violet" />
        <StatCard icon={PlaneTakeoff} label="Flights on offer" value={String(totalFlights)} hint="Across all routes" />
        <StatCard
          icon={UserRound}
          label="Signed in as"
          value={isAdmin ? 'Admin' : 'Traveler'}
          hint={user?.email}
          accent="violet"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-100">Booking activity</h2>
            <span className="text-xs text-ink-500">Last 6 months</span>
          </div>
          {trend.every((t) => t.count === 0) ? (
            <div className="flex h-56 items-center justify-center text-sm text-ink-500">
              No bookings yet — your activity will show up here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trend} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3fd0ff" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#3fd0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#182034" vertical={false} />
                <XAxis dataKey="label" stroke="#6b7594" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7594" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: '#0d1220',
                    border: '1px solid #232d45',
                    borderRadius: 12,
                    color: '#eef2fb',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#8b96b8' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3fd0ff" strokeWidth={2} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-base font-semibold text-ink-100">Next up</h2>
          {stats.next.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No upcoming trips"
              description="Book a flight and it'll appear here."
              action={
                <Link to="/flights" className="btn-primary mt-2">
                  Browse flights
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {stats.next.map((b) => (
                <li key={b.id} className="rounded-xl border border-base-700/60 bg-base-900/60 p-3.5">
                  <p className="text-sm font-semibold text-ink-100">
                    {b.origin} → {b.destination}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">{formatDateTime(b.departureTime)}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    Seat {b.rowNumber}
                    {b.seatLetter} · {b.flightNumber}
                  </p>
                </li>
              ))}
              <Link to="/bookings" className="block pt-1 text-center text-xs font-semibold text-cyan-glow hover:underline">
                View all bookings
              </Link>
            </ul>
          )}
        </div>
      </div>

      {flights && flights.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-100">Explore upcoming flights</h2>
            <Link to="/flights" className="text-xs font-semibold text-cyan-glow hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {flights.map((f) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const GUIDE_STEPS = [
  { icon: Search, title: 'Find a flight', text: 'Open "Book a flight" and filter by origin, destination or date.', to: '/flights' },
  { icon: Armchair, title: 'Choose a seat', text: 'Click a flight, then click any free (blue) seat on the seat map.' },
  { icon: Ticket, title: 'Confirm', text: 'Press "Confirm booking". Your trip appears under "My bookings".', to: '/bookings' },
]

/** Shown until the first booking, so new users know exactly what to do next. */
function GettingStarted() {
  return (
    <section aria-labelledby="getting-started" className="glow-card rounded-2xl p-6">
      <h2 id="getting-started" className="text-base font-semibold text-ink-100">
        Book your first flight in 3 steps
      </h2>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {GUIDE_STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3 rounded-xl border border-base-700/60 bg-base-900/60 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-glow/10 text-sm font-bold text-cyan-glow">
              {i + 1}
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-100">
                <step.icon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                {step.to ? (
                  <Link to={step.to} className="hover:text-cyan-glow hover:underline">
                    {step.title}
                  </Link>
                ) : (
                  step.title
                )}
              </p>
              <p className="mt-1 text-sm text-ink-400">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function buildMonthlyTrend(bookings: BookingResponse[]) {
  const months: { key: string; label: string; count: number }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: 'short' }), count: 0 })
  }
  const byKey = new Map(months.map((m) => [m.key, m]))
  for (const b of bookings) {
    const d = new Date(b.bookingDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = byKey.get(key)
    if (bucket) bucket.count += 1
  }
  return months
}
