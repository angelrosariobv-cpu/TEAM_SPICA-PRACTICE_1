# Team Spica frontend

React, TypeScript and Vite public flight lookup page.

## Commands

- `npm run dev`: start the development server.
- `npm run typecheck`: check TypeScript types.
- `npm run build`: check types and build for production.
- `npm run preview`: serve the production build locally.
- `node --experimental-strip-types --test flights.test.mjs`: run lookup tests with Node 24.

No lint tool is configured.

## API routing

The browser requests `GET /flights/{flight_number}` on the same origin.
Route `/flights/` to FastAPI through the hosting reverse proxy. A separate local
API address must be confirmed before adding a Vite development proxy.
The API returns a FlightResponse on success and HTTP 404 for an unknown flight.
Connection errors, invalid responses and server errors stay on the search form.

`/results` is a provisional page; it does not display flight details yet.
`/login` is a placeholder for future authentication. Both routes must use the
SPA fallback in production, while `/flights/` must reach FastAPI.
