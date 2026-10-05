import { useState, type FormEvent } from 'react'
import { PlaneTakeoff, Save } from 'lucide-react'
import type { AircraftResponse, FlightResponse } from '../../types'
import { Spinner } from '../ui/Spinner'
import { toDatetimeLocalValue } from '../../lib/format'

export interface FlightFormValues {
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  aircraftId: number | null
  tags: string[]
}

interface FlightFormProps {
  mode: 'create' | 'edit'
  aircraft: AircraftResponse[]
  initial?: FlightResponse | null
  isSubmitting: boolean
  error: string | null
  onSubmit: (values: FlightFormValues) => void
}

export function FlightForm({ mode, aircraft, initial, isSubmitting, error, onSubmit }: FlightFormProps) {
  const [flightNumber, setFlightNumber] = useState(initial?.flightNumber ?? '')
  const [origin, setOrigin] = useState(initial?.origin ?? '')
  const [destination, setDestination] = useState(initial?.destination ?? '')
  const [departureTime, setDepartureTime] = useState(initial ? toDatetimeLocalValue(initial.departureTime) : '')
  const [arrivalTime, setArrivalTime] = useState(initial ? toDatetimeLocalValue(initial.arrivalTime) : '')
  const [aircraftId, setAircraftId] = useState<number | null>(initial?.aircraftId ?? aircraft[0]?.id ?? null)
  const [tagsText, setTagsText] = useState(initial?.tags.join(', ') ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      flightNumber: flightNumber.trim().toUpperCase(),
      origin: origin.trim(),
      destination: destination.trim(),
      departureTime: new Date(departureTime).toISOString(),
      arrivalTime: new Date(arrivalTime).toISOString(),
      aircraftId,
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Flight number</label>
          <input
            required
            maxLength={10}
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="FB100"
            className="field-input"
          />
        </div>

        {mode === 'create' && (
          <div>
            <label className="field-label">Aircraft</label>
            <select
              required
              value={aircraftId ?? ''}
              onChange={(e) => setAircraftId(Number(e.target.value))}
              className="field-input"
            >
              <option value="" disabled>
                Select aircraft
              </option>
              {aircraft.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.model} · {a.totalSeats} seats
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="field-label">Origin</label>
          <input
            required
            maxLength={100}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="TLV"
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label">Destination</label>
          <input
            required
            maxLength={100}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="JFK"
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label">Departure</label>
          <input
            required
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label">Arrival</label>
          <input
            required
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="field-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Tags (comma separated)</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Direct, RedEye"
            className="field-input"
          />
          {tagsText.trim() && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagsText
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag} className="rounded-full bg-base-800 px-2 py-0.5 text-[11px] text-ink-400">
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? (
          <Spinner className="h-4 w-4 border-base-950/40 border-t-base-950" />
        ) : mode === 'create' ? (
          <PlaneTakeoff className="h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {mode === 'create' ? 'Create flight' : 'Save changes'}
      </button>
    </form>
  )
}
