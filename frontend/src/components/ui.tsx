import type { ReactNode } from 'react'
import type { FlightStatus } from '../flights'
import { statusLabels } from '../flights'

export function Icon({ name = 'plane', className = 'size-5' }: { name?: 'plane' | 'arrow' | 'clock' | 'grid' | 'route' | 'user'; className?: string }) {
  const paths = {
    plane: <path d="m21.8 16-8.4-4.8V5.5a1.5 1.5 0 0 0-3 0v5.7L2 16v2.3l8.4-2.6v4.5L8 21.7V23l3.9-.8 3.9.8v-1.3l-2.4-1.5v-4.5l8.4 2.6Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  }
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <a href="/" className={`inline-flex items-center gap-3 text-lg font-extrabold tracking-tight ${inverse ? 'text-white' : 'text-ink'}`} aria-label="Flights PTY home"><span className={`grid size-10 place-items-center rounded-xl ${inverse ? 'bg-white text-primary' : 'bg-primary text-white'}`}><Icon className="size-6 -rotate-12" /></span>Flights <span className={inverse ? 'text-blue-200' : 'text-secondary'}>PTY</span></a>
}

const tones: Record<FlightStatus, string> = {
  scheduled: 'bg-emerald-50 text-emerald-800', departed: 'bg-blue-50 text-blue-800',
  arrived: 'bg-blue-50 text-blue-800', cancelled: 'bg-red-50 text-red-800',
  delayed: 'bg-orange-50 text-orange-800', boarding: 'bg-yellow-50 text-yellow-800',
}
export function StatusBadge({ status }: { status: FlightStatus }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${tones[status]}`}><span className="size-1.5 rounded-full bg-current" />{statusLabels[status]}</span>
}

export function Notice({ children, error = false, retry }: { children: ReactNode; error?: boolean; retry?: () => void }) {
  return <div role={error ? 'alert' : 'status'} className={`rounded-2xl border p-6 ${error ? 'border-red-200 bg-red-50 text-red-900' : 'border-line bg-white text-slate'}`}><p>{children}</p>{retry && <button className="btn secondary mt-4" onClick={retry}>Try again</button>}</div>
}
