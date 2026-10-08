import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock3, PlaneTakeoff, Tag as TagIcon, Ticket, Users } from 'lucide-react'
import { flightsApi, bookingsApi } from '../lib/endpoints'
import type { FlightResponse, SeatResponse } from '../types'
import { PageSpinner, Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { SeatMap, SeatMapLegend } from '../components/SeatMap'
import { formatDate, formatDuration, formatTime } from '../lib/format'
import { ApiError } from '../lib/api'
import { useToast } from '../context/ToastContext'

export function FlightDetailPage() {
  const { id } = useParams<{ id: string }>()
  const flightId = Number(id)
  const navigate = useNavigate()
  const { notify } = useToast()

  const [flight, setFlight] = useState<FlightResponse | null>(null)
  const [seats, setSeats] = useState<SeatResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<SeatResponse | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [flightRes, seatsRes] = await Promise.all([
        flightsApi.getById(flightId),
        flightsApi.getSeats(flightId),
      ])
      setFlight(flightRes)
      setSeats(seatsRes)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load this flight.')
    } finally {
      setIsLoading(false)
    }
  }, [flightId])

  useEffect(() => {
    load()
  }, [load])

  const handleConfirm = async () => {
    if (!selected) return
    setIsBooking(true)
    try {
      const booking = await bookingsApi.create({ flightSeatId: selected.flightSeatId })
      notify(`Seat ${booking.rowNumber}${booking.seatLetter} booked · ref ${booking.reference}`, 'success')
      navigate('/bookings')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Booking failed. Please try again.'
      notify(message, 'error')
      if (err instanceof ApiError && err.status === 409) {
        setSelected(null)
        const seatsRes = await flightsApi.getSeats(flightId).catch(() => null)
        if (seatsRes) setSeats(seatsRes)
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) return <PageSpinner label="Loading flight…" />

  if (error || !flight) {
    return <EmptyState icon={PlaneTakeoff} title="Flight not found" description={error ?? undefined} />
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="btn-ghost !px-3 !py-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="glow-card rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-800 text-cyan-glow">
              <PlaneTakeoff className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{flight.flightNumber}</p>
              <h1 className="text-xl font-bold text-ink-100">
                {flight.origin} <span className="text-ink-500">→</span> {flight.destination}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {flight.tags.map((tag) => (
              <span key={tag} className="badge border-base-600/70 bg-base-800/70 text-ink-300">
                <TagIcon className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat icon={CalendarDays} label="Departure" value={formatDate(flight.departureTime)} />
          <Stat icon={Clock3} label="Time" value={`${formatTime(flight.departureTime)} – ${formatTime(flight.arrivalTime)}`} />
          <Stat icon={Clock3} label="Duration" value={formatDuration(flight.departureTime, flight.arrivalTime)} />
          <Stat icon={Users} label="Available" value={`${flight.availableSeats} seats`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-100">Step 1 · Choose your seat</h2>
            <SeatMapLegend />
          </div>
          {seats.length === 0 ? (
            <EmptyState icon={Ticket} title="No seat map available" description="This flight has no seats configured." />
          ) : (
            <SeatMap seats={seats} selectedSeatId={selected?.flightSeatId ?? null} onSelect={setSelected} />
          )}
        </div>

        <div className="glow-card sticky top-20 h-fit rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-ink-100">Step 2 · Review &amp; confirm</h3>

          {selected ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-violet-glow/30 bg-violet-glow/10 p-4 text-center">
                <p className="text-xs text-ink-400">Selected seat</p>
                <p className="mt-1 text-2xl font-bold text-violet-glow">
                  {selected.rowNumber}
                  {selected.seatLetter}
                </p>
              </div>
              <dl className="space-y-1.5 text-sm">
                <Row label="Flight" value={flight.flightNumber} />
                <Row label="Route" value={`${flight.origin} → ${flight.destination}`} />
                <Row label="Departs" value={`${formatDate(flight.departureTime)}, ${formatTime(flight.departureTime)}`} />
              </dl>
              <button onClick={handleConfirm} disabled={isBooking} className="btn-primary mt-2 w-full">
                {isBooking ? <Spinner className="h-4 w-4 border-base-950/40 border-t-base-950" /> : <Ticket className="h-4 w-4" />}
                Confirm booking
              </button>
              <p className="text-center text-[11px] text-ink-500">
                Bookings close 2 hours before departure.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-400">
              Click any blue (available) seat on the map. Its details will appear here, together with the <strong className="text-ink-200">Confirm booking</strong> button.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-base-700/60 bg-base-900/60 p-3.5">
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-ink-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="text-sm font-semibold text-ink-100">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="truncate font-medium text-ink-200">{value}</dd>
    </div>
  )
}
