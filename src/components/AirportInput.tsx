import { useId, useState } from 'react'
import { clsx } from 'clsx'
import { MapPin } from 'lucide-react'
import { airportLabel, searchAirports } from '../lib/airports'

interface AirportInputProps {
  label: string
  /** Free text currently in the box (a country, a city, or the label of a picked airport). */
  text: string
  onTextChange: (text: string) => void
  placeholder?: string
  error?: string | null
}

/**
 * Autocomplete for airports: people type a country or city ("France", "פריז") and pick an airport
 * from the list. The parent resolves the final text to an IATA code with `resolveAirport`.
 */
export function AirportInput({ label, text, onTextChange, placeholder, error }: AirportInputProps) {
  const id = useId()
  const listId = `${id}-list`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const options = open ? searchAirports(text) : []
  const showList = open && options.length > 0

  const pick = (code: string) => {
    onTextChange(airportLabel(code))
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) {
      if (e.key === 'ArrowDown') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(options[active].code)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          aria-hidden="true"
        />
        <input
          id={id}
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${id}-opt-${active}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          value={text}
          onChange={(e) => {
            onTextChange(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          // Delay so a click on an option registers before the list disappears.
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={clsx('field-input pl-9', error && '!border-red-400/70')}
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="glass-card absolute z-30 mt-1.5 max-h-72 w-full min-w-[260px] overflow-y-auto rounded-xl p-1.5"
        >
          {options.map((airport, i) => (
            <li
              key={airport.code}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(airport.code)}
              onMouseEnter={() => setActive(i)}
              className={clsx(
                'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2',
                i === active ? 'bg-base-700/70' : 'hover:bg-base-700/50',
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink-100">
                  {airport.city} – {airport.name}
                </span>
                <span className="block text-xs text-ink-400">{airport.country}</span>
              </span>
              <span className="shrink-0 rounded-md bg-base-800 px-1.5 py-0.5 font-mono text-xs font-semibold text-cyan-glow">
                {airport.code}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
