/**
 * Google Sheets data layer.
 *
 * Sheet layout (row 1 is the header):
 *   A: id | B: name | C: starter | D: main | E: dessert | F: updatedAt
 */

import { google } from 'googleapis'
import { config } from './config.js'
import { normalizeMeal } from './mealModel.js'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// Column indices (0-based)
const COL = { id: 0, name: 1, starter: 2, main: 3, dessert: 4, updatedAt: 5 }
const HEADER = ['id', 'name', 'starter', 'main', 'dessert', 'updatedAt']

function getAuth() {
  let credentials
  try {
    credentials = JSON.parse(config.googleCredentials)
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY must be a valid JSON string')
  }
  return new google.auth.GoogleAuth({ credentials, scopes: SCOPES })
}

async function getSheets() {
  const auth = getAuth()
  return google.sheets({ version: 'v4', auth })
}

function rowToParticipant(row) {
  return {
    id: row[COL.id] ?? '',
    name: row[COL.name] ?? '',
    starter: row[COL.starter] ?? 'None',
    main: row[COL.main] ?? 'None',
    dessert: row[COL.dessert] ?? 'None',
    updatedAt: row[COL.updatedAt] ?? new Date().toISOString(),
  }
}

async function getAllRows(sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheetId,
    range: `${config.sheetName}!A:F`,
  })
  const rows = res.data.values ?? []
  // Skip header row if present
  if (rows.length > 0 && rows[0][0] === 'id') {
    return rows.slice(1)
  }
  return rows
}

async function ensureHeader(sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheetId,
    range: `${config.sheetName}!A1:F1`,
  })
  const firstRow = res.data.values?.[0] ?? []
  if (firstRow[0] !== 'id') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.sheetId,
      range: `${config.sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER] },
    })
  }
}

export async function sheetList() {
  const sheets = await getSheets()
  const rows = await getAllRows(sheets)
  return rows.filter((r) => r[COL.id]).map(rowToParticipant)
}

export async function sheetAdd(name, meal) {
  const sheets = await getSheets()
  await ensureHeader(sheets)

  const id = `p-${globalThis.crypto.randomUUID()}`
  const normalized = normalizeMeal(meal)
  const now = new Date().toISOString()
  const row = [id, name, normalized.starter, normalized.main, normalized.dessert, now]

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range: `${config.sheetName}!A:F`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  })

  return { id, name, ...normalized, updatedAt: now }
}

export async function sheetUpdateMeal(id, meal) {
  const sheets = await getSheets()
  const rows = await getAllRows(sheets)
  const rowIndex = rows.findIndex((r) => r[COL.id] === id)
  if (rowIndex === -1) return null

  const normalized = normalizeMeal(meal)
  const now = new Date().toISOString()
  // +2 because rows are 0-indexed and we have a header row
  const sheetRow = rowIndex + 2

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.sheetId,
    range: `${config.sheetName}!C${sheetRow}:F${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[normalized.starter, normalized.main, normalized.dessert, now]] },
  })

  return { ...rowToParticipant(rows[rowIndex]), ...normalized, updatedAt: now }
}

export async function sheetRemove(id) {
  const sheets = await getSheets()
  const rows = await getAllRows(sheets)
  const rowIndex = rows.findIndex((r) => r[COL.id] === id)
  if (rowIndex === -1) return false

  // Get spreadsheet to find the sheet's numeric id
  const meta = await sheets.spreadsheets.get({ spreadsheetId: config.sheetId })
  const sheet = meta.data.sheets?.find(
    (s) => s.properties?.title === config.sheetName,
  )
  const sheetId = sheet?.properties?.sheetId ?? 0

  // +1 for 0-indexed → 1-indexed, +1 for header row
  const startIndex = rowIndex + 1
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex,
              endIndex: startIndex + 1,
            },
          },
        },
      ],
    },
  })

  return true
}
