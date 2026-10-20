import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getFlight, listFlights, flightStats, validateFlightNumber } from './src/flights.ts'

const flight = { flight_number: 'CM 204', origin: 'PTY', destination: 'MIA', status: 'scheduled', scheduled_time: '2026-10-18T10:00:00', delay_minutes: 0, airline: 'Copa Airlines' }

test('flight numbers follow the backend length contract', () => {
  assert.ok(validateFlightNumber('   '))
  assert.ok(validateFlightNumber('A'.repeat(21)))
  assert.equal(validateFlightNumber(' CM 204 '), null)
})

test('GET services validate responses and handle missing, offline and invalid data', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'http://127.0.0.1:8000/flights/CM%20204')
    assert.equal(options.method, 'GET')
    return Response.json(flight)
  })
  assert.deepEqual(await getFlight(' CM 204 '), flight)
  mock.mock.mockImplementation(async () => Response.json([flight]))
  assert.deepEqual(await listFlights(), [flight])
  mock.mock.mockImplementation(async () => Response.json([]))
  assert.deepEqual(await listFlights(), [])
  mock.mock.mockImplementation(async () => Response.json({ detail: 'Flight not found' }, { status: 404 }))
  await assert.rejects(getFlight('CM204'), error => error.status === 404)
  mock.mock.mockImplementation(async () => new Response(null, { status: 503 }))
  await assert.rejects(listFlights(), /no está disponible/)
  mock.mock.mockImplementation(async () => { throw new TypeError('Failed to fetch') })
  await assert.rejects(listFlights(), /conectar/)
  mock.mock.mockImplementation(async () => new Response('<html>SPA fallback</html>'))
  await assert.rejects(listFlights(), /respuesta inesperada/)
  mock.mock.mockImplementation(async () => Response.json([{ ...flight, delay_minutes: -1 }]))
  await assert.rejects(listFlights(), /respuesta inesperada/)
  mock.mock.mockImplementation(async () => Response.json({ ...flight, flight_number: 'OTHER' }))
  await assert.rejects(getFlight('CM204'), /diferente/)
  mock.mock.mockImplementation(async () => { throw new Error('Programming failure') })
  await assert.rejects(listFlights(), /Programming failure/)
})

test('statistics count actual flights and unique airports', () => {
  assert.deepEqual(flightStats([]), { active: 0, delayed: 0, airlines: 0, airports: 0 })
  assert.deepEqual(flightStats([flight, { ...flight, flight_number: 'CM205', status: 'delayed' }, { ...flight, flight_number: 'CM206', status: 'arrived' }]), { active: 2, delayed: 1, airlines: 1, airports: 2 })
})
