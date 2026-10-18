import { useState } from 'react'
import type { FormEvent } from 'react'
import { findFlight, validateFlightNumber } from './flights'
import './styles.css'

function FlightSearch() {
  const [flightNumber, setFlightNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    const validationError = validateFlightNumber(flightNumber)
    setError(validationError)
    if (validationError) return
    setLoading(true)
    try {
      const outcome = await findFlight(flightNumber)
      window.location.assign(`/results?flight=${encodeURIComponent(flightNumber.trim())}&outcome=${outcome}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo consultar el vuelo.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="hero">
        <h1>FLIGHT STATUS</h1>
        <p>Información de vuelos en tiempo real</p>
      </div>
      <section className="search-card" aria-label="Consulta de vuelos">
        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          <label htmlFor="flight-number">Ingrese número de vuelo</label>
          <p className="field-help" id="flight-help">Consulte su vuelo antes de viajar.</p>
          <div className="search-controls">
            <input id="flight-number" name="flight-number" type="text"
              placeholder="Ejemplo: CM204" autoComplete="off" autoCapitalize="characters"
              spellCheck={false} maxLength={20} required readOnly={loading}
              value={flightNumber} onChange={(event) => { setFlightNumber(event.target.value); setError(null) }}
              aria-invalid={Boolean(error)} aria-describedby={error ? 'flight-help flight-error' : 'flight-help'} />
            <button type="submit" disabled={loading}>{loading ? 'Buscando…' : 'Buscar vuelo'}</button>
          </div>
          {error && <p id="flight-error" className="error" role="alert">{error}</p>}
          <p className="search-note" role="status">{loading ? 'Consultando el estado de su vuelo…' : 'El número de vuelo aparece en su itinerario o pase de abordar.'}</p>
        </form>
      </section>
    </>
  )
}

export default function App() {
  const path = window.location.pathname
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="site-header">
        <nav className="header-content" aria-label="Navegación principal">
          <a className="brand" href="/" aria-label="Flight Status, inicio">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m4 19 10-4V6c0-3 4-3 4 0v9l10 4v3l-10-2v6l3 2v2l-5-1-5 1v-2l3-2v-6L4 22z" fill="currentColor" /></svg>
            Flight Status
          </a>
          <a className="login-link" href="/login">Iniciar sesión</a>
        </nav>
      </header>
      <main id="main-content" className="main-content">
        {path === '/' ? <FlightSearch /> : (
          <section className="placeholder-card">
            <h1>{path === '/results' ? 'Resultados de vuelo' : path === '/login' ? 'Iniciar sesión' : 'Página no encontrada'}</h1>
            <p>{path === '/results'
              ? new URLSearchParams(window.location.search).get('outcome') === 'not-found' ? 'No se encontró el vuelo consultado. Verifique el número e intente nuevamente.' : 'No hay resultados disponibles en esta vista provisional. La página de detalle estará disponible próximamente.'
              : path === '/login' ? 'El acceso a cuentas estará disponible próximamente.' : 'La dirección solicitada no está disponible.'}</p>
            <a className="back-link" href="/">Volver a consultar un vuelo</a>
          </section>
        )}
      </main>
      <footer>Practice for HACKATHON COPA 2026 — Team Spica</footer>
    </div>
  )
}

