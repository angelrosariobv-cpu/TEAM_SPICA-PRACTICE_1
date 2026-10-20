export class ApiError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const baseUrl = (import.meta.env?.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '')
  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: 'GET', headers: { Accept: 'application/json' },
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    })
  } catch (error) {
    if (signal?.aborted) throw error
    if (error instanceof TypeError || (error instanceof DOMException && error.name === 'TimeoutError')) {
      throw new ApiError('No pudimos conectar con el servicio de vuelos. Intente nuevamente.')
    }
    throw error
  }
  if (!response.ok) throw new ApiError(response.status === 404 ? 'No se encontró el vuelo.' : 'El servicio de vuelos no está disponible. Intente nuevamente.', response.status)
  try { return await response.json() }
  catch { throw new ApiError('El servicio devolvió una respuesta inesperada. Intente nuevamente.') }
}
