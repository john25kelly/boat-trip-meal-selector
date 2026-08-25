/**
 * In-memory mock store used when USE_MOCK=true or GOOGLE_SHEET_ID is not set.
 * This lets you run the backend locally without any Google credentials.
 */

import { DEFAULT_MEAL, normalizeMeal } from './mealModel.js'

let store = [
  {
    id: 'p-1',
    name: 'Skipper Sam',
    ...DEFAULT_MEAL,
    starter: 'Soup',
    main: 'Fish',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-2',
    name: 'Deckhand Aileen',
    ...DEFAULT_MEAL,
    main: 'Vegetarian pasta',
    dessert: 'Cheesecake',
    updatedAt: new Date().toISOString(),
  },
]

export function mockList() {
  return [...store]
}

export function mockAdd(name, meal) {
  const participant = {
    id: `p-${globalThis.crypto.randomUUID()}`,
    name,
    ...normalizeMeal(meal),
    updatedAt: new Date().toISOString(),
  }
  store = [participant, ...store]
  return participant
}

export function mockUpdateMeal(id, meal) {
  const idx = store.findIndex((p) => p.id === id)
  if (idx === -1) return null
  store[idx] = { ...store[idx], ...normalizeMeal(meal), updatedAt: new Date().toISOString() }
  return store[idx]
}

export function mockRemove(id) {
  const exists = store.some((p) => p.id === id)
  if (!exists) return false
  store = store.filter((p) => p.id !== id)
  return true
}
