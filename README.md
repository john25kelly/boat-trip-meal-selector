# Boat Trip Meal Selector (Leisure 17 / EDYC)

React-based self-service meal selection app for Leisure 17 boats and the EDYC boat club.

## What is included

- Polished nautical-themed React UI (mobile + desktop)
- Landing/login page
- Protected application shell
- Participant list view
- Starter / Main / Dessert meal selection per participant (each defaults to **None**)
- Add/remove participant flows
- Inline status and confirmation feedback
- Auth provider/context + protected routes with placeholder session model
- Node.js/Express backend with Google Sheets integration

## Architecture

The spreadsheet is the **source of truth**, but credentials are never exposed in the browser.

### Frontend (`/` — this repo root)

- `src/auth/AuthContext.jsx`: placeholder auth/session architecture ready for real auth integration
- `src/components/ProtectedRoute.jsx`: route guard
- `src/pages/*`: landing/login, app shell, participant workflows
- `src/services/participantsService.js`: app service functions (mock or real API)
- `src/services/apiClient.js`: API boundary (`VITE_API_BASE_URL`)
- `src/models/participant.js`: participant and meal data model (Starter/Main/Dessert)

### Backend (`/backend`)

Node.js/Express service that owns Google Sheets credentials and exposes a REST API.

- `backend/src/server.js`: Express app entry point
- `backend/src/routes.js`: `/api/participants` route handlers
- `backend/src/participantsService.js`: delegates to mock or Sheets store
- `backend/src/sheetsStore.js`: Google Sheets read/write using a service account
- `backend/src/mockStore.js`: in-memory mock store for local development
- `backend/src/mealModel.js`: shared meal choice validation
- `backend/src/config.js`: environment variable configuration

### API contract

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/participants` | List all participants |
| `POST` | `/api/participants` | Add a participant |
| `PATCH` | `/api/participants/:id/meal` | Update Starter, Main, Dessert |
| `DELETE` | `/api/participants/:id` | Remove a participant |
| `GET` | `/api/health` | Health check |

Each participant object:

```json
{
  "id": "p-abc123",
  "name": "Skipper Sam",
  "starter": "Soup",
  "main": "Fish",
  "dessert": "None",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Environment configuration

### Frontend

Copy `.env.example` to `.env`:

```
VITE_APP_NAME=Boat Trip Meal Selector
VITE_API_BASE_URL=http://localhost:8787/api
VITE_AUTH_SESSION_KEY=boat-trip-meal-selector-session
VITE_USE_MOCK_API=true        # set to false to use the real backend
```

### Backend

Copy `backend/.env.example` to `backend/.env`:

```
PORT=8787
USE_MOCK=true                 # set to false when Google credentials are ready
GOOGLE_SHEET_ID=<sheet-id>
GOOGLE_SHEET_NAME=Participants
GOOGLE_SERVICE_ACCOUNT_KEY=<json-string>
```

## Development

### Frontend only (mock API)

```bash
npm install
npm run dev
```

### Backend (mock mode — no Google credentials needed)

```bash
cd backend
npm install
npm run dev        # or: USE_MOCK=true node src/server.js
```

### Frontend + backend together

```bash
# Terminal 1 — backend
cd backend && USE_MOCK=true npm run dev

# Terminal 2 — frontend (set VITE_USE_MOCK_API=false in .env)
npm run dev
```

## Build

```bash
npm run build
```

## Google Sheets setup

1. Create (or reuse) a Google Cloud project.
2. Enable the **Google Sheets API**.
3. Create a **Service Account** and download the JSON key.
4. Share the target spreadsheet with the service account's email address (Editor role).
5. Set `GOOGLE_SERVICE_ACCOUNT_KEY` to the JSON key content (as a single-line JSON string).
6. Set `GOOGLE_SHEET_ID` to the spreadsheet ID from its URL.
7. Set `USE_MOCK=false`.

Sheet layout (auto-created on first write):

| A: id | B: name | C: starter | D: main | E: dessert | F: updatedAt |

## Notes on credentials

- Do **not** put service-account keys or OAuth client secrets in the frontend.
- Frontend calls the backend only.
- Backend holds credentials securely (environment variables or a secret manager) and performs all Google Sheets operations server-side.
