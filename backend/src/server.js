import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import participantRoutes from './routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/participants', participantRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mock: config.useMock })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message ?? 'Internal server error' })
})

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port} [mock=${config.useMock}]`)
})
