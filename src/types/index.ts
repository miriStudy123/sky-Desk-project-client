export type Role = 'User' | 'Admin'

export interface UserResponse {
  id: number
  name: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  expiresAtUtc: string
  user: UserResponse
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface FlightResponse {
  id: number
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  aircraftId: number
  aircraftModel: string
  availableSeats: number
  tags: string[]
}

export interface FlightSearchParams {
  origin?: string
  destination?: string
  departureFrom?: string
  departureTo?: string
  tag?: string
  page?: number
  pageSize?: number
}

export type SeatStatus = 'Available' | 'Held' | 'Booked'

export interface SeatResponse {
  flightSeatId: number
  rowNumber: number
  seatLetter: string
  status: SeatStatus
}

export type BookingStatus = 'Confirmed' | 'Cancelled'

export interface BookingResponse {
  id: number
  reference: string
  flightSeatId: number
  flightId: number
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  rowNumber: number
  seatLetter: string
  bookingDate: string
  status: BookingStatus
}

export interface CreateBookingRequest {
  flightSeatId: number
}

export interface AircraftResponse {
  id: number
  model: string
  totalSeats: number
}

export interface CreateFlightRequest {
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  aircraftId: number
  tags: string[]
}

export interface UpdateFlightRequest {
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  tags: string[]
}

export interface ApiProblem {
  type?: string
  title?: string
  status?: number
  detail?: string
  correlationId?: string
  errors?: Record<string, string[]>
}
