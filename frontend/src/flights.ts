export function validateFlightNumber(value: string): string | null {
  if (!value.trim()) return 'Ingrese un número de vuelo.'
  if (!/^[a-zA-Z0-9]{1,20}$/.test(value.trim())) {
    return 'Use solo letras y números, hasta 20 caracteres.'
  }
  return null
}

export async function findFlight(flightNumber: string): Promise<'found' | 'not-found'> {
  let response: Response
  try {
    response = await fetch(`/flights/${encodeURIComponent(flightNumber.trim())}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error('No pudimos conectar con el servicio de vuelos. Intente nuevamente.')
  }
  if (response.status === 404) {
    const body: unknown = await response.json().catch(() => null)
    if (body && typeof body === 'object' && 'detail' in body && body.detail === 'Flight not found') return 'not-found'
    throw new Error('No pudimos conectar con el servicio de vuelos. Intente nuevamente.')
  }
  if (!response.ok) throw new Error('El servicio de vuelos no está disponible. Intente nuevamente.')
  // Reject an SPA fallback page returned when the API has not been routed.
  const flight: unknown = await response.json().catch(() => null)
  if (!flight || typeof flight !== 'object' || !('flight_number' in flight) ||
      flight.flight_number !== flightNumber.trim()) {
    throw new Error('El servicio devolvió una respuesta inesperada. Intente nuevamente.')
  }
  return 'found'
}

