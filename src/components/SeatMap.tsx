import { useMemo } from 'react'
import { clsx } from 'clsx'
import { Lock } from 'lucide-react'
import type { SeatResponse } from '../types'

interface SeatMapProps {
  seats: SeatResponse[]
  selectedSeatId: number | null
  onSelect: (seat: SeatResponse) => void
}

export function SeatMap({ seats, selectedSeatId, onSelect }: SeatMapProps) {
  const { rows, letters } = useMemo(() => {
    const letterSet = Array.from(new Set(seats.map((s) => s.seatLetter))).sort()
    const rowMap = new Map<number, SeatResponse[]>()
    for (const seat of seats) {
      const list = rowMap.get(seat.rowNumber) ?? []
      list.push(seat)
      rowMap.set(seat.rowNumber, list)
    }
    const rowNumbers = Array.from(rowMap.keys()).sort((a, b) => a - b)
    return {
      rows: rowNumbers.map((rowNumber) => ({
        rowNumber,
        seats: rowMap.get(rowNumber)!.sort((a, b) => a.seatLetter.localeCompare(b.seatLetter)),
      })),
      letters: letterSet,
    }
  }, [seats])

  const aisleIndex = Math.ceil(letters.length / 2)

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full flex-col items-center gap-1.5 px-2 py-1">
        <div className="mb-1 flex items-center gap-1.5 pl-9">
          {letters.map((letter, i) => (
            <span
              key={letter}
              className={clsx('w-9 text-center text-[11px] font-semibold text-ink-500', i === aisleIndex && 'ml-6')}
            >
              {letter}
            </span>
          ))}
        </div>

        {rows.map((row) => (
          <div key={row.rowNumber} className="flex items-center gap-1.5">
            <span className="w-7 shrink-0 text-right text-[11px] font-medium text-ink-500">{row.rowNumber}</span>
            {row.seats.map((seat, i) => {
              const isSelected = seat.flightSeatId === selectedSeatId
              const isAvailable = seat.status === 'Available'
              return (
                <button
                  key={seat.flightSeatId}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSelect(seat)}
                  title={`Seat ${row.rowNumber}${seat.seatLetter} · ${isSelected ? 'Selected' : isAvailable ? 'Available – click to select' : 'Occupied'}`}
                  aria-label={`Seat ${row.rowNumber}${seat.seatLetter}, ${isSelected ? 'selected' : isAvailable ? 'available' : 'occupied'}`}
                  aria-pressed={isSelected}
                  className={clsx(
                    'flex h-9 w-9 items-center justify-center rounded-lg border text-[11px] font-semibold transition-all',
                    i === aisleIndex && 'ml-6',
                    isSelected &&
                      'border-violet-glow bg-violet-glow/25 text-violet-glow shadow-glow-violet scale-105',
                    !isSelected &&
                      isAvailable &&
                      'border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow/25 hover:shadow-glow cursor-pointer',
                    !isSelected &&
                      !isAvailable &&
                      'cursor-not-allowed border-base-600/60 bg-base-800/60 text-ink-500',
                  )}
                >
                  {isAvailable || isSelected ? `${seat.seatLetter}` : <Lock className="h-3 w-3" />}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SeatMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-ink-400">
      <LegendItem className="border-cyan-glow/30 bg-cyan-glow/10" label="Available" />
      <LegendItem className="border-violet-glow bg-violet-glow/25" label='Selected' />
      <LegendItem className="border-base-600/60 bg-base-800/60" label='Occupied' />
    </div>
  )
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={clsx('h-3.5 w-3.5 rounded border', className)} />
      {label}
    </span>
  )
}
