import { useState } from 'react'
import type { FormEvent } from 'react'
import { validateFlightNumber } from '../flights'

export function FlightSearch() {
  const [number, setNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  function submit(event: FormEvent) {
    event.preventDefault()
    const message = validateFlightNumber(number)
    setError(message)
    if (!message) window.location.assign(`/results?flight=${encodeURIComponent(number.trim())}`)
  }
  return <form onSubmit={submit} noValidate className="grid gap-3"><label htmlFor="flight-number" className="text-sm font-bold">Find your flight</label><div className="flex flex-col gap-3 sm:flex-row"><input id="flight-number" className="field flex-1" value={number} onChange={event => { setNumber(event.target.value); setError(null) }} placeholder="Flight number, e.g. CM204" maxLength={20} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? 'search-error' : undefined} /><button className="btn" type="submit">Find flight</button></div>{error && <p id="search-error" role="alert" className="text-sm text-red-800">{error}</p>}</form>
}
