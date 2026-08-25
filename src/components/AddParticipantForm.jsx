import { useState } from 'react'
import { DESSERT_OPTIONS, MAIN_OPTIONS, STARTER_OPTIONS } from '../models/participant'

export function AddParticipantForm({ onAdd, busy }) {
  const [name, setName] = useState('')
  const [starter, setStarter] = useState('None')
  const [main, setMain] = useState('None')
  const [dessert, setDessert] = useState('None')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    await onAdd({ name: name.trim(), starter, main, dessert })
    setName('')
    setStarter('None')
    setMain('None')
    setDessert('None')
  }

  return (
    <form className="card card--compact" onSubmit={handleSubmit}>
      <h2>Add crew member</h2>
      <div className="grid two-column">
        <label>
          Name
          <input
            name="participantName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
            placeholder="e.g. Alex"
            required
          />
        </label>
        <label>
          Starter
          <select
            name="participantStarter"
            value={starter}
            onChange={(event) => setStarter(event.target.value)}
            disabled={busy}
          >
            {STARTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Main
          <select
            name="participantMain"
            value={main}
            onChange={(event) => setMain(event.target.value)}
            disabled={busy}
          >
            {MAIN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Dessert
          <select
            name="participantDessert"
            value={dessert}
            onChange={(event) => setDessert(event.target.value)}
            disabled={busy}
          >
            {DESSERT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={busy || !name.trim()}>
        {busy ? 'Adding…' : 'Add participant'}
      </button>
    </form>
  )
}
