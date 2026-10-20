import { useState } from 'react'
import { statuses, statusLabels } from '../flights'
import type { Flight } from '../flights'
import { useFlightData } from '../useFlightData'
import { FlightTable } from '../components/FlightTable'
import { FlightSearch } from '../components/FlightSearch'
import { Notice } from '../components/ui'

export function FlightDashboard() {
  const { data, loading, error, retry, updated } = useFlightData()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ airline: '', status: '', origin: '', destination: '' })
  const filtered = data.filter(flight => `${flight.flight_number} ${flight.airline}`.toLowerCase().includes(search.toLowerCase()) && Object.entries(filters).every(([key, value]) => !value || flight[key as keyof Flight] === value))
  return <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-secondary">Public operations board</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Flight Tracking</h1><p className="mt-2 text-sm text-slate">Flight schedules, routes and latest available status.</p></div><button className="btn secondary" disabled={loading} onClick={retry}>Refresh flights</button></div><div className="mb-5 rounded-2xl border border-line bg-white p-4"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-bold text-slate">Search flights<input className="field mt-2" value={search} onChange={event => setSearch(event.target.value)} placeholder="Number or airline" /></label>{(Object.keys(filters) as (keyof typeof filters)[]).map(key => <label key={key} className="text-xs font-bold text-slate"><span className="capitalize">{key}</span><select className="field mt-2" value={filters[key]} onChange={event => setFilters({ ...filters, [key]: event.target.value })}><option value="">All {key}s</option>{(key === 'status' ? statuses : [...new Set(data.map(flight => flight[key]))].sort()).map(value => <option key={value} value={value}>{key === 'status' ? statusLabels[value as keyof typeof statusLabels] : value}</option>)}</select></label>)}</div></div>{loading ? <Notice>Loading flights…</Notice> : error ? <Notice error retry={retry}>{error.message}</Notice> : <><div className="mb-3 flex flex-wrap justify-between gap-2 text-sm text-slate"><p><strong>{filtered.length}</strong> flights found</p><p>{updated && `Retrieved at ${updated.toLocaleTimeString()}`}</p></div>{filtered.length ? <FlightTable flights={filtered} /> : <Notice>{data.length ? 'No flights match your search. Change or clear the filters.' : 'No flights are currently available.'}</Notice>}</>}<div className="mt-8 max-w-xl rounded-2xl border border-line bg-white p-6"><FlightSearch /></div></section>
}
