import { ApiError, getJson } from './services/api.ts'

export const statuses = ['scheduled', 'departed', 'arrived', 'cancelled', 'delayed', 'boarding'] as const
export type FlightStatus = typeof statuses[number]
export type Flight = {
  flight_number: string
  origin: string
  destination: string
  status: FlightStatus
  scheduled_time: string
  delay_minutes: number
  airline: string
}
export const statusLabels: Record<FlightStatus, string> = {
  scheduled: 'Scheduled', departed: 'Departed', arrived: 'Arrived',
  cancelled: 'Cancelled', delayed: 'Delayed', boarding: 'Boarding',
}
export function validateFlightNumber(value: string): string | null {
  if (!value.trim()) return 'Ingrese un número de vuelo.'
  if (value.trim().length > 20) return 'Use hasta 20 caracteres.'
  return null
}
function parseFlight(value: unknown): Flight {
  if (!value || typeof value !== 'object') throw new ApiError('Respuesta de vuelo inválida.')
  const flight = value as Record<string, unknown>
  if (['flight_number', 'origin', 'destination', 'scheduled_time', 'airline'].some(key => typeof flight[key] !== 'string' || !flight[key]) ||
      !statuses.includes(flight.status as FlightStatus) || !Number.isInteger(flight.delay_minutes)) {
    throw new ApiError('El servicio devolvió una respuesta inesperada. Intente nuevamente.')
  }
  return flight as Flight
}
export async function listFlights(signal?: AbortSignal): Promise<Flight[]> {
  const data = await getJson('/flights/', signal)
  if (!Array.isArray(data)) throw new ApiError('El servicio devolvió una lista de vuelos inválida.')
  return data.map(parseFlight)
}
export async function getFlight(number: string, signal?: AbortSignal): Promise<Flight> {
  const error = validateFlightNumber(number)
  if (error) throw new ApiError(error)
  const flight = parseFlight(await getJson(`/flights/${encodeURIComponent(number.trim())}`, signal))
  if (flight.flight_number !== number.trim()) throw new ApiError('El servicio devolvió un vuelo diferente al solicitado.')
  return flight
}
export function flightStats(flights: Flight[]) {
  return {
    active: flights.filter(flight => !['arrived', 'cancelled'].includes(flight.status)).length,
    delayed: flights.filter(flight => flight.status === 'delayed').length,
    airlines: new Set(flights.map(flight => flight.airline)).size,
    airports: new Set(flights.flatMap(flight => [flight.origin, flight.destination])).size,
  }
}
