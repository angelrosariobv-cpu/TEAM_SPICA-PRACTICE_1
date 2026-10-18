import assert from 'node:assert/strict'
import { test } from 'node:test'
import { findFlight, validateFlightNumber } from './src/flights.ts'

test('flight input rejects blanks and punctuation but accepts alphanumeric numbers', () => {
  assert.ok(validateFlightNumber('   '))
  assert.ok(validateFlightNumber('CM/204'))
  assert.ok(validateFlightNumber('A'.repeat(21)))
  assert.equal(validateFlightNumber(' CM204 '), null)
})

test('flight lookup handles the verified API contract and failures', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch')
  mock.mock.mockImplementation(async (url) => {
    assert.equal(url, '/flights/CM204')
    return Response.json({ flight_number: 'CM204' })
  })
  assert.equal(await findFlight('CM204'), 'found')
  mock.mock.mockImplementation(async () => Response.json({ detail: 'Flight not found' }, { status: 404 }))
  assert.equal(await findFlight('CM204'), 'not-found')
  mock.mock.mockImplementation(async () => new Response(null, { status: 404 }))
  await assert.rejects(findFlight('CM204'), /conectar/)
  mock.mock.mockImplementation(async () => new Response(null, { status: 500 }))
  await assert.rejects(findFlight('CM204'), /no está disponible/)
  mock.mock.mockImplementation(async () => { throw new TypeError('Failed to fetch') })
  await assert.rejects(findFlight('CM204'), /conectar/)
  mock.mock.mockImplementation(async () => new Response('<html>SPA fallback</html>'))
  await assert.rejects(findFlight('CM204'), /respuesta inesperada/)
})

