import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, hasPreviousPage, hasNextPage, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        className="btn-ghost !px-3"
        disabled={!hasPreviousPage}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-ink-400">
        Page <span className="font-semibold text-ink-100">{page}</span> of {totalPages}
      </span>
      <button
        className="btn-ghost !px-3"
        disabled={!hasNextPage}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
