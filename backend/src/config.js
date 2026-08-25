// Central configuration — read from environment variables.
// Copy .env.example to .env and fill in real values.

export const config = {
  port: parseInt(process.env.PORT ?? '8787', 10),

  // Set to 'true' to run without Google Sheets (in-memory mock data)
  useMock: process.env.USE_MOCK === 'true' || !process.env.GOOGLE_SHEET_ID,

  // Google Sheets
  sheetId: process.env.GOOGLE_SHEET_ID ?? '',
  sheetName: process.env.GOOGLE_SHEET_NAME ?? 'Participants',

  // Service-account credentials — provide as a JSON string or a file path
  googleCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? '',
}
