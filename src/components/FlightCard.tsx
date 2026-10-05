import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock3, PlaneTakeoff, Users } from 'lucide-react'
import { clsx } from 'clsx'
import type { FlightResponse } from '../types'
import { formatDate, formatDuration, formatTime } from '../lib/format'

export function FlightCard({ flight }: { flight: FlightResponse }) {
  const navigate = useNavigate()
  const low = flight.availableSeats <= 5 && flight.availableSeats > 0
  const soldOut = flight.availableSeats === 0

  return (
    <button
      onClick={() => navigate(`/flights/${flight.id}`)}
      className="glass-card group w-full rounded-2xl p-5 text-left transition-all hover:border-cyan-glow/40 hover:shadow-glow"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-800 text-cyan-glow">
            <PlaneTakeoff className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-100">{flight.flightNumber}</p>
            <p className="text-xs text-ink-500">{flight.aircraftModel}</p>
          </div>
        </div>

        <span
          className={clsx(
            'badge',
            soldOut
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : low
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
          )}
        >
          <Users className="h-3 w-3" />
          {soldOut ? 'Sold out' : `${flight.availableSeats} seats left`}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-lg font-bold leading-tight text-ink-100">{formatTime(flight.departureTime)}</p>
          <p className="text-xs text-ink-500">{flight.origin}</p>
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <p className="mb-1 flex items-center gap-1 text-[11px] text-ink-500">
            <Clock3 className="h-3 w-3" />
            {formatDuration(flight.departureTime, flight.arrivalTime)}
          </p>
          <div className="relative h-px w-full bg-base-600">
            <ArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-ink-500 group-hover:text-cyan-glow" />
          </div>
        </div>

        <div className="flex-1 text-right">
          <p className="text-lg font-bold leading-tight text-ink-100">{formatTime(flight.arrivalTime)}</p>
          <p className="text-xs text-ink-500">{flight.destination}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-base-700/60 pt-3.5">
        <p className="text-xs text-ink-500">{formatDate(flight.departureTime)}</p>
        <div className="flex flex-wrap gap-1.5">
          {flight.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-base-800 px-2 py-0.5 text-[11px] text-ink-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
