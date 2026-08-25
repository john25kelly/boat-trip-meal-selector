import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { StatusMessage } from '../components/StatusMessage'

export function LandingPage() {
  const { isAuthenticated, login } = useAuth()
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await login({ name })
      setStatus('Welcome aboard. Taking you to the crew list…')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="landing">
      <section className="hero-card card">
        <p className="eyebrow">Leisure 17 · EDYC</p>
        <h1>Boat Trip Meal Selector</h1>
        <p>
          A self-service meal board for day sails and club gatherings. Crew can add members, update meals,
          and remove names when plans change.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Skipper name"
              disabled={busy}
              required
            />
          </label>
          <button type="submit" disabled={busy || !name.trim()}>
            {busy ? 'Signing in…' : 'Enter meal board'}
          </button>
        </form>
        <StatusMessage type="success">{status}</StatusMessage>
        <StatusMessage type="error">{error}</StatusMessage>
        <p className="meta">Auth is a placeholder session model ready for real provider integration.</p>
      </section>
    </main>
  )
}
