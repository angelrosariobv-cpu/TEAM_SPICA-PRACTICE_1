import { Home } from './pages/Home'
import { FlightDashboard } from './pages/FlightDashboard'
import { FlightDetail } from './pages/FlightDetail'
import { Login } from './pages/Login'
import { Icon, Logo, Notice } from './components/ui'
import './styles.css'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const number = new URLSearchParams(window.location.search).get('flight') ?? ''
  return <div className="flex min-h-screen flex-col"><a href="#main-content" className="skip-link">Skip to content</a><header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur"><nav aria-label="Main navigation" className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 lg:px-8"><Logo /><div className="flex items-center gap-2"><a href="/flights" className="rounded-xl px-3 py-2 text-sm font-bold text-primary" aria-current={path === '/flights' ? 'page' : undefined}>Track Flights</a><a href="/login" className="btn secondary" aria-current={path === '/login' ? 'page' : undefined}><Icon name="user" />Login</a></div></nav></header><main id="main-content" className="flex-1">{path === '/' ? <Home /> : path === '/flights' ? <FlightDashboard /> : path === '/results' ? <FlightDetail number={number} /> : path === '/login' ? <Login /> : <div className="mx-auto max-w-3xl px-5 py-16"><Notice>{path === '/admin' ? 'Administration is in development.' : 'Page not found.'}</Notice><a className="btn mt-6" href="/">Return home</a></div>}</main><footer className="border-t border-line bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-7 lg:px-8"><Logo /><p className="text-xs text-slate">© {new Date().getFullYear()} Flights PTY. Team Spica.</p><span className="text-xs text-slate">Flight operations information</span></div></footer></div>
}
