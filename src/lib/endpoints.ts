import { api } from './api'
import type {
  AircraftResponse,
  AuthResponse,
  BookingResponse,
  CreateBookingRequest,
  CreateFlightRequest,
  FlightResponse,
  FlightSearchParams,
  LoginRequest,
  PagedResult,
  RegisterRequest,
  SeatResponse,
  UpdateFlightRequest,
} from '../types'

export const authApi = {
  login: (body: LoginRequest) => api.post<AuthResponse>('/auth/login', body).then((r) => r.data),
  register: (body: RegisterRequest) => api.post<AuthResponse>('/auth/register', body).then((r) => r.data),
}

export const flightsApi = {
  search: (params: FlightSearchParams) =>
    api.get<PagedResult<FlightResponse>>('/flights', { params }).then((r) => r.data),
  getById: (id: number) => api.get<FlightResponse>(`/flights/${id}`).then((r) => r.data),
  getSeats: (flightId: number) => api.get<SeatResponse[]>(`/flights/${flightId}/seats`).then((r) => r.data),
  create: (body: CreateFlightRequest) => api.post<FlightResponse>('/flights', body).then((r) => r.data),
  update: (id: number, body: UpdateFlightRequest) =>
    api.put<FlightResponse>(`/flights/${id}`, body).then((r) => r.data),
  remove: (id: number) => api.delete(`/flights/${id}`),
}

export const bookingsApi = {
  create: (body: CreateBookingRequest) => api.post<BookingResponse>('/bookings', body).then((r) => r.data),
  mine: (page = 1, pageSize = 20) =>
    api.get<PagedResult<BookingResponse>>('/bookings/my', { params: { page, pageSize } }).then((r) => r.data),
  getById: (id: number) => api.get<BookingResponse>(`/bookings/${id}`).then((r) => r.data),
  cancel: (id: number) => api.delete(`/bookings/${id}`),
}

export const aircraftApi = {
  list: () => api.get<AircraftResponse[]>('/aircraft').then((r) => r.data),
}
