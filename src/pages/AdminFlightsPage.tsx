import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pencil, Plus, PlaneTakeoff, Trash2, Users } from 'lucide-react'
import { aircraftApi, flightsApi } from '../lib/endpoints'
import type { AircraftResponse, FlightResponse, PagedResult } from '../types'
import { PageSpinner, Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { Modal } from '../components/ui/Modal'
import { FlightForm, type FlightFormValues } from '../components/admin/FlightForm'
import { formatDateTime } from '../lib/format'
import { ApiError } from '../lib/api'
import { useToast } from '../context/ToastContext'

type ModalState = { kind: 'create' } | { kind: 'edit'; flight: FlightResponse } | { kind: 'delete'; flight: FlightResponse } | null

export function AdminFlightsPage() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1')
  const { notify } = useToast()

  const [result, setResult] = useState<PagedResult<FlightResponse> | null>(null)
  const [aircraft, setAircraft] = useState<AircraftResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = () => {
    setIsLoading(true)
    setError(null)
    flightsApi
      .search({ page, pageSize: 8 })
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load flights.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [page])

  useEffect(() => {
    aircraftApi.list().then(setAircraft).catch(() => setAircraft([]))
  }, [])

  const closeModal = () => {
    setModal(null)
    setFormError(null)
  }

  const handleCreate = async (values: FlightFormValues) => {
    if (!values.aircraftId) {
      setFormError('Please select an aircraft.')
      return
    }
    setIsSubmitting(true)
    setFormError(null)
    try {
      await flightsApi.create({ ...values, aircraftId: values.aircraftId })
      notify(`Flight ${values.flightNumber} created.`, 'success')
      closeModal()
      load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to create flight.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (id: number, values: FlightFormValues) => {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await flightsApi.update(id, values)
      notify(`Flight ${values.flightNumber} updated.`, 'success')
      closeModal()
      load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to update flight.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (flight: FlightResponse) => {
    setIsSubmitting(true)
    try {
      await flightsApi.remove(flight.id)
      notify(`Flight ${flight.flightNumber} deleted.`, 'success')
      closeModal()
      load()
    } catch (err) {
      notify(err instanceof ApiError ? err.message : 'Failed to delete flight.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Manage flights</h1>
          <p className="mt-1 text-sm text-ink-400">Create, edit, and retire flights across your fleet.</p>
        </div>
        <button onClick={() => setModal({ kind: 'create' })} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add flight
        </button>
      </div>

      {isLoading && <PageSpinner label="Loading flights…" />}
      {!isLoading && error && <EmptyState icon={PlaneTakeoff} title="Couldn't load flights" description={error} />}

      {!isLoading && !error && result && result.items.length === 0 && (
        <EmptyState
          icon={PlaneTakeoff}
          title="No flights yet"
          description="Create your first flight to get started."
          action={
            <button onClick={() => setModal({ kind: 'create' })} className="btn-primary mt-2">
              Add flight
            </button>
          }
        />
      )}

      {!isLoading && !error && result && result.items.length > 0 && (
        <>
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-base-700/60 text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Flight</th>
                    <th className="px-5 py-3 font-medium">Route</th>
                    <th className="px-5 py-3 font-medium">Departs</th>
                    <th className="px-5 py-3 font-medium">Aircraft</th>
                    <th className="px-5 py-3 font-medium">Seats</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-700/50">
                  {result.items.map((f) => (
                    <tr key={f.id} className="hover:bg-base-800/40">
                      <td className="px-5 py-3.5 font-semibold text-ink-100">{f.flightNumber}</td>
                      <td className="px-5 py-3.5 text-ink-300">
                        {f.origin} → {f.destination}
                      </td>
                      <td className="px-5 py-3.5 text-ink-400">{formatDateTime(f.departureTime)}</td>
                      <td className="px-5 py-3.5 text-ink-400">{f.aircraftModel}</td>
                      <td className="px-5 py-3.5">
                        <span className="badge border-base-600/70 bg-base-800/70 text-ink-300">
                          <Users className="h-3 w-3" />
                          {f.availableSeats}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setModal({ kind: 'edit', flight: f })}
                            className="btn-ghost !p-2"
                            aria-label="Edit flight"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setModal({ kind: 'delete', flight: f })}
                            className="btn-danger !p-2"
                            aria-label="Delete flight"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        open={modal?.kind === 'create'}
        onClose={closeModal}
        title="Add a new flight"
        subtitle="A seat is created automatically for every seat on the selected aircraft."
      >
        {aircraft.length === 0 ? (
          <p className="text-sm text-ink-400">No aircraft available. Add aircraft to the database first.</p>
        ) : (
          <FlightForm mode="create" aircraft={aircraft} isSubmitting={isSubmitting} error={formError} onSubmit={handleCreate} />
        )}
      </Modal>

      <Modal
        open={modal?.kind === 'edit'}
        onClose={closeModal}
        title="Edit flight"
        subtitle="The aircraft for an existing flight can't be changed."
      >
        {modal?.kind === 'edit' && (
          <FlightForm
            mode="edit"
            aircraft={aircraft}
            initial={modal.flight}
            isSubmitting={isSubmitting}
            error={formError}
            onSubmit={(values) => handleEdit(modal.flight.id, values)}
          />
        )}
      </Modal>

      <Modal open={modal?.kind === 'delete'} onClose={closeModal} title="Delete this flight?" width="max-w-sm">
        {modal?.kind === 'delete' && (
          <div className="space-y-4">
            <p className="text-sm text-ink-400">
              This permanently removes <span className="font-semibold text-ink-200">{modal.flight.flightNumber}</span>{' '}
              ({modal.flight.origin} → {modal.flight.destination}). Flights with confirmed bookings can't be deleted.
            </p>
            <div className="flex gap-2">
              <button onClick={closeModal} className="btn-ghost flex-1">
                Keep flight
              </button>
              <button onClick={() => handleDelete(modal.flight)} disabled={isSubmitting} className="btn-danger flex-1">
                {isSubmitting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
