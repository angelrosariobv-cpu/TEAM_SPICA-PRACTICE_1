# Team Spica frontend

Public flight tracking UI adapted from the Flights PTY Figma Make design.
React + TypeScript + Vite, with Tailwind CSS v4 styling.

## Technical specifications

The current dependencies are declared in [package.json](./package.json); exact
resolved versions are recorded in [package-lock.json](./package-lock.json).

| Technology | Declared version | Purpose |
| --- | --- | --- |
| React / React DOM | `^19.3.0` | Functional UI components |
| TypeScript | `~6.0.2` | Static type checking |
| Vite | `^8.3.4` | Development server and production build |
| Tailwind CSS / Vite plugin | `^4.0.0` | Styling |

Use Node.js 24 for the documented commands, including the native TypeScript tests.
Vite's installed package requires Node.js `^20.19.0 || >=22.12.0`.
The current implementation uses local UI components and pathname-based navigation;
shadcn/ui and React Router are not installed.

## Run locally

Use two terminals: one for FastAPI and one for Vite. The following commands use
PowerShell and start from the repository root.

### 1. Start the backend

You need Python compatible with [the backend requirements](../backend/requirements.txt)
and access to the team's existing PostgreSQL database.
For a first-time setup:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

If `backend/.env` does not already exist, copy the example without overwriting an
existing configuration:

```powershell
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
```

Set `DATABASE_URL` in `backend/.env` to the connection details provided by the team.
Keep these credentials on the backend only. Start the API:

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API documentation: <http://127.0.0.1:8000/docs>.
Liveness check: <http://127.0.0.1:8000/health>. A successful health response does
not verify database connectivity; flight endpoints require a working database.

### 2. Start the frontend

In a second terminal, starting from the repository root:

```powershell
cd frontend
npm.cmd ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open <http://127.0.0.1:5173>. Stop either server with `Ctrl+C` in its terminal.
On subsequent runs, start the two servers; repeat dependency installation only
when needed after dependency changes.

The frontend environment setting is:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Set it in `.env.local` to the FastAPI base URL, without the `/flights` suffix.
The same URL is the default when the variable is absent. Restart Vite after
changing it. Vite variables are exposed to the browser; never put secrets here.
For production, set this value before building.

On Bash, use `npm` instead of `npm.cmd` and `cp` instead of `Copy-Item`.
The `.cmd` form avoids the PowerShell execution-policy restriction on `npm.ps1`.

## Validation and production build

Run from the frontend directory:

```powershell
npm.cmd run typecheck
node --experimental-strip-types --test flights.test.mjs
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 5173 --strictPort
```

The build generates `dist/`. Preview serves that build locally and requires the
development server to be stopped first when using the same port. It is not a
production hosting service. No lint tool or additional test framework is configured.
The tests mock API responses; they do not verify a live backend or database.

## Source structure

- [src/App.tsx](./src/App.tsx): page selection and shared application layout.
- [src/pages/](./src/pages/): home, flight dashboard, detail and login pages.
- [src/components/](./src/components/): shared search, table and UI components.
- [src/services/api.ts](./src/services/api.ts): HTTP requests and service errors.
- [src/flights.ts](./src/flights.ts): flight types, response validation and statistics.
- [src/useFlightData.ts](./src/useFlightData.ts): loading, cancellation and retry state.
- [src/styles.css](./src/styles.css): Tailwind import and application styles.
- [flights.test.mjs](./flights.test.mjs): native Node.js service and validation tests.

## Pages and API

- `/`: public landing page and statistics calculated from `GET /flights/`.
- `/flights`: public table and local filters over the complete list.
- `/results?flight=CM204`: detail from `GET /flights/{flight_number}`.
- `/login`: preserved login layout, disabled while authentication is in development.
- `/admin`: development notice, no administrative API calls.

The dashboard searches by flight number or airline and filters by airline, status,
origin and destination in the browser. Data loads on page entry and on manual
refresh; there is no automatic polling.

The API response fields are `flight_number`, `origin`, `destination`, `status`,
`scheduled_time`, `delay_minutes` and `airline`. The contract is defined in the
[backend schemas](../backend/app/schemas/flights.py) and
[router](../backend/app/routers/flights.py).

The flight number is the backend primary key. There is no numeric flight ID.
Statuses use the backend values: scheduled, departed, arrived, cancelled, delayed,
boarding. Schedule strings are displayed unchanged because the API does not define
an explicit timezone contract. Statistics describe the returned records, not a
separate airline/airport inventory. No sample flights are used as fallback data.

Only GET operations are implemented. Creating, editing and deleting flights,
accounts, authentication and sessions remain unavailable. Navigation is public.
Loading, empty, missing-flight, invalid-response and connection-error states have
visible messages; retry is available for failed service requests. Unexpected
programming errors are rethrown instead of being mislabeled as network failures.

## Backend and deployment

Run the existing FastAPI service separately. Its default CORS configuration allows
`http://localhost:5173` and `http://127.0.0.1:5173`. Other deployment origins require
coordination with the backend team. No backend configuration is changed here.
The API must be reachable from the user's browser; use HTTPS with an HTTPS frontend.
Configure the frontend host to serve the SPA fallback for page navigation. When
using a shared origin, reserve `/flights/` for API traffic and preserve the frontend
`/flights` page route, or use a separate API origin.

Inter is loaded from Google Fonts, with system fonts as an offline fallback.
The page shell remains usable while the API is unavailable. Request timeout: 15s.

## Troubleshooting

- **Connection error:** verify that FastAPI is running on the configured base URL
  and inspect the request in the browser's Network panel.
- **HTTP 503 from flight endpoints:** the backend database is unconfigured or
  unavailable; a successful `/health` response does not rule this out.
- **CORS error:** use the documented frontend origin on port 5173, or coordinate
  the required `CORS_ORIGINS` setting with the backend team.
- **Port 5173 already in use:** stop the existing process or coordinate a different
  port and its CORS origin. `--strictPort` prevents silently switching ports.
- **Flight not found:** search for an existing flight number returned by the API.
  The example query above does not guarantee that `CM204` exists in the database.
