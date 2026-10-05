import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, PlaneTakeoff, Ticket, X } from 'lucide-react'
import { bookingsApi } from '../lib/endpoints'
import type { BookingResponse, PagedResult } from '../types'
import { PageSpinner, Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { formatDateTime } from '../lib/format'
import { ApiError } from '../lib/api'
import { useToast } from '../context/ToastContext'

export function MyBookingsPage() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const { notify } = useToast()

  const [result, setResult] = useState<PagedResult<BookingResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toCancel, setToCancel] = useState<BookingResponse | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const load = () => {
    setIsLoading(true)
    setError(null)
    bookingsApi
      .mine(page, 10)
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load your bookings.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [page])

  const confirmCancel = async () => {
    if (!toCancel) return
    setIsCancelling(true)
    try {
      await bookingsApi.cancel(toCancel.id)
      notify(`Booking ${toCancel.reference} cancelled.`, 'success')
      setToCancel(null)
      load()
    } catch (err) {
      notify(err instanceof ApiError ? err.message : 'Could not cancel this booking.', 'error')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">My bookings</h1>
          <p className="mt-1 text-sm text-ink-400">Everything you've booked, and what's still upcoming.</p>
        </div>
        <Link to="/flights" className="btn-primary">
          <PlaneTakeoff className="h-4 w-4" />
          Book a flight
        </Link>
      </div>

      {isLoading && <PageSpinner label="Loading your bookings…" />}

      {!isLoading && error && <EmptyState icon={Ticket} title="Couldn't load bookings" description={error} />}

      {!isLoading && !error && result && result.items.length === 0 && (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Search for a flight and reserve your seat — it'll show up here."
          action={
            <Link to="/flights" className="btn-primary mt-2">
              Browse flights
            </Link>
          }
        />
      )}

      {!isLoading && !error && result && result.items.length > 0 && (
        <>
          <div className="space-y-3">
            {result.items.map((b) => (
              <div key={b.id} className="glass-card flex flex-wrap items-center gap-4 rounded-2xl p-4 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-800 text-cyan-glow">
                  <PlaneTakeoff className="h-5 w-5" />
                </span>

                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-semibold text-ink-100">
                    {b.origin} <span className="text-ink-500">→</span> {b.destination}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDateTime(b.departureTime)}
                  </p>
                </div>

                <div className="text-sm text-ink-400">
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">Flight</p>
                  <p className="font-medium text-ink-200">{b.flightNumber}</p>
                </div>

                <div className="text-sm text-ink-400">
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">Seat</p>
                  <p className="font-medium text-ink-200">
                    {b.rowNumber}
                    {b.seatLetter}
                  </p>
                </div>

                <div className="text-sm text-ink-400">
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">Reference</p>
                  <p className="font-mono font-medium text-ink-200">{b.reference}</p>
                </div>

                <StatusBadge status={b.status} />

                {b.status === 'Confirmed' && (
                  <button onClick={() => setToCancel(b)} className="btn-danger !py-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            hasPreviousPage={result.hasPreviousPage}
            hasNextPage={result.hasNextPage}
            onChange={(p) => {
              const next = new URLSearchParams(params)
              next.set('page', String(p))
              setParams(next)
            }}
          />
        </>
      )}

      <Modal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        title="Cancel this booking?"
        subtitle="This will release the seat back to other travelers. This can't be undone."
        width="max-w-sm"
      >
        {toCancel && (
          <div className="space-y-4">
            <div className="rounded-xl border border-base-600/70 bg-base-900/60 p-4 text-sm">
              <p className="font-semibold text-ink-100">
                {toCancel.origin} → {toCancel.destination}
              </p>
              <p className="mt-1 text-ink-400">
                Seat {toCancel.rowNumber}
                {toCancel.seatLetter} · {formatDateTime(toCancel.departureTime)}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setToCancel(null)} className="btn-ghost flex-1">
                Keep booking
              </button>
              <button onClick={confirmCancel} disabled={isCancelling} className="btn-danger flex-1">
                {isCancelling ? <Spinner className="h-4 w-4" /> : <X className="h-4 w-4" />}
                Cancel it
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
