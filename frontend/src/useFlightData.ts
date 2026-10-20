import { useEffect, useState } from 'react'
import { getFlight, listFlights } from './flights'
import type { Flight } from './flights'
import { ApiError } from './services/api'

export function useFlightData(number?: string) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ data: Flight[]; loading: boolean; error: ApiError | null; updated: Date | null }>({
    data: [], loading: true, error: null, updated: null,
  })
  const [unexpected, setUnexpected] = useState<Error | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    setState({ data: [], loading: true, error: null, updated: null })
    const request = number === undefined ? listFlights(controller.signal) : getFlight(number, controller.signal).then(flight => [flight])
    request.then(data => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: null, updated: new Date() })
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return
      if (error instanceof ApiError) setState({ data: [], loading: false, error, updated: null })
      else setUnexpected(error instanceof Error ? error : new Error(String(error)))
    })
    return () => controller.abort()
  }, [number, attempt])
  if (unexpected) throw unexpected
  return { ...state, retry: () => setAttempt(value => value + 1) }
}
