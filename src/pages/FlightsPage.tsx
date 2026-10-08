import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlaneTakeoff, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { flightsApi } from '../lib/endpoints'
import type { FlightResponse, PagedResult } from '../types'
import { FlightCard } from '../components/FlightCard'
import { PageSpinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { ApiError } from '../lib/api'
import { AirportInput } from '../components/AirportInput'
import { airportLabel, resolveAirport, type AirportResolution } from '../lib/airports'

const codeToText = (code: string | null) => (code ? airportLabel(code) : '')

/** Error shown under an airport field when its text can't be turned into one airport code. */
function airportError(resolution: AirportResolution): string | null {
  if (resolution.kind === 'unknown') return 'No airport found. Try a country or city name, e.g. France or Paris.'
  if (resolution.kind === 'ambiguous') {
    const codes = resolution.options.slice(0, 4).map((a) => `${a.city} (${a.code})`).join(', ')
    return `There are several airports here – pick one from the list: ${codes}${resolution.options.length > 4 ? '…' : ''}`
  }
  return null
}

export function FlightsPage() {
  const [params, setParams] = useSearchParams()
  const [result, setResult] = useState<PagedResult<FlightResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // The boxes hold readable text ("Paris – Charles de Gaulle (CDG)"); only the code goes to the URL and the API.
  const [origin, setOrigin] = useState(codeToText(params.get('origin')))
  const [destination, setDestination] = useState(codeToText(params.get('destination')))
  const [originError, setOriginError] = useState<string | null>(null)
  const [destinationError, setDestinationError] = useState<string | null>(null)
  const [departureFrom, setDepartureFrom] = useState(params.get('departureFrom') ?? '')
  const [tag, setTag] = useState(params.get('tag') ?? '')

  const page = Number(params.get('page') ?? '1')

  useEffect(() => {
    setOrigin(codeToText(params.get('origin')))
    setDestination(codeToText(params.get('destination')))
    setDepartureFrom(params.get('departureFrom') ?? '')
    setTag(params.get('tag') ?? '')
  }, [params])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    flightsApi
      .search({
        origin: params.get('origin') || undefined,
        destination: params.get('destination') || undefined,
        departureFrom: params.get('departureFrom') || undefined,
        tag: params.get('tag') || undefined,
        page,
        pageSize: 9,
      })
      .then((res) => {
        if (!cancelled) setResult(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load flights.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [params, page])

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const from = resolveAirport(origin)
    const to = resolveAirport(destination)
    setOriginError(airportError(from))
    setDestinationError(airportError(to))
    if (airportError(from) || airportError(to)) return

    const next = new URLSearchParams()
    if (from.kind === 'code') next.set('origin', from.code)
    if (to.kind === 'code') next.set('destination', to.code)
    if (departureFrom) next.set('departureFrom', departureFrom)
    if (tag) next.set('tag', tag)
    next.set('page', '1')
    setParams(next)
  }

  const clearFilters = () => {
    setOrigin('')
    setDestination('')
    setOriginError(null)
    setDestinationError(null)
    setDepartureFrom('')
    setTag('')
    setParams({})
  }

  const hasFilters = !!(params.get('origin') || params.get('destination') || params.get('departureFrom') || params.get('tag'))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Find your flight</h1>
        <p className="mt-1 text-sm text-ink-400">Type a country or city and choose an airport from the list. All fields are optional – press Search, then click a flight to pick your seat.</p>
      </div>

      <form onSubmit={applyFilters} className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <AirportInput
            label="From (origin)"
            text={origin}
            onTextChange={(t) => {
              setOrigin(t)
              setOriginError(null)
            }}
            placeholder="Country or city, e.g. Israel"
            error={originError}
          />
          <AirportInput
            label="To (destination)"
            text={destination}
            onTextChange={(t) => {
              setDestination(t)
              setDestinationError(null)
            }}
            placeholder="Country or city, e.g. France"
            error={destinationError}
          />
          <div>
            <label htmlFor="f-date" className="field-label">Departing on or after</label>
            <input
              type="date"
              value={departureFrom}
              id="f-date"
              onChange={(e) => setDepartureFrom(e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="f-tag" className="field-label">Tag (e.g. Direct)</label>
            <input
              value={tag}
              id="f-tag"
              onChange={(e) => setTag(e.target.value)}
              placeholder="Direct, Night…"
              className="field-input"
            />
          </div>
          <div className="flex items-end gap-2 self-start pt-[22px]">
            <button type="submit" className="btn-primary flex-1">
              <Search className="h-4 w-4" />
              Search
            </button>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-ghost !px-3" aria-label="Clear all filters" title="Clear all filters">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {isLoading && <PageSpinner label="Searching flights…" />}

      {!isLoading && error && (
        <EmptyState icon={SlidersHorizontal} title="Couldn't load flights" description={error} />
      )}

      {!isLoading && !error && result && result.items.length === 0 && (
        <EmptyState
          icon={PlaneTakeoff}
          title="No flights match your search"
          description="Try widening your filters or clearing them to see everything on offer."
          action={
            hasFilters ? (
              <button onClick={clearFilters} className="btn-ghost mt-2">
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && result && result.items.length > 0 && (
        <>
          <p className="text-sm text-ink-500">{result.totalCount} flight{result.totalCount === 1 ? '' : 's'} found</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
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
    </div>
  )
}
