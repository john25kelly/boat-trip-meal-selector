/**
 * Unified participants service — delegates to mock or Google Sheets store
 * depending on the USE_MOCK configuration flag.
 */

import { config } from './config.js'
import { mockAdd, mockList, mockRemove, mockUpdateMeal } from './mockStore.js'
import { sheetAdd, sheetList, sheetRemove, sheetUpdateMeal } from './sheetsStore.js'

const useMock = config.useMock

export async function list() {
  return useMock ? mockList() : sheetList()
}

export async function add(name, meal) {
  return useMock ? mockAdd(name, meal) : sheetAdd(name, meal)
}

export async function updateMeal(id, meal) {
  return useMock ? mockUpdateMeal(id, meal) : sheetUpdateMeal(id, meal)
}

export async function remove(id) {
  return useMock ? mockRemove(id) : sheetRemove(id)
}
