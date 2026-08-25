# Boat Trip Meal Selector (Leisure 17 / EDYC)

React-based self-service meal selection app for Leisure 17 boats and the EDYC boat club.

## What is included


- Polished nautical-themed React UI (mobile + desktop)
- Landing/login page
- Protected application shell
- Participant list view
- Meal choice edit flow
- Add/remove participant flows
- Inline status and confirmation feedback
- Auth provider/context + protected routes with placeholder session model
- Google Sheets integration boundary through a service layer

## Architecture


The spreadsheet is the **source of truth**, but credentials are never exposed in the browser.

### Frontend (this repo)

- `src/auth/AuthContext.jsx`: placeholder auth/session architecture ready for real auth integration
- `src/components/ProtectedRoute.jsx`: route guard
- `src/pages/*`: landing/login, app shell, participant workflows
- `src/services/participantsService.js`: app service functions
- `src/services/apiClient.js`: API boundary (`VITE_API_BASE_URL`)
- `src/models/participant.js`: participant and meal data model

### Backend boundary (to implement next)

The frontend assumes a backend/API layer that owns write credentials and talks to Google Sheets.

Recommended backend responsibilities:

1. Authenticate/authorize users (club auth provider, Google OAuth, or another identity provider)
2. Validate payloads and enforce app-level permissions
3. Read/write rows in the configured Google Sheet
4. Return normalized participant records

### Suggested API contract

- `GET /participants` -> list participants
- `POST /participants` -> add participant
- `PATCH /participants/:id/meal` -> update meal choice
- `DELETE /participants/:id` -> remove participant

## Environment configuration

Copy `.env.example` to `.env` and adjust values:

- `VITE_GOOGLE_SHEET_ID`: Google spreadsheet ID (ID only)
- `VITE_API_BASE_URL`: backend API base URL
- `VITE_AUTH_SESSION_KEY`: local placeholder auth session key
- `VITE_USE_MOCK_API`: `true` for in-memory mock mode, `false` for real backend mode

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes on Google Sheets write access

- Do **not** put service-account keys or OAuth client secrets in the frontend.
- Frontend should call your backend only.
- Backend should hold credentials securely (environment variables/secret manager), then perform Google Sheets write operations on behalf of authenticated users.
