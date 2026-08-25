import { useState } from 'react'
import { DEFAULT_MEAL, DESSERT_CHOICES, MAIN_CHOICES, STARTER_CHOICES } from '../models/participant'

export function AddParticipantForm({ onAdd, busy }) {
  const [name, setName] = useState('')
  const [starter, setStarter] = useState(DEFAULT_MEAL.starter)
  const [main, setMain] = useState(DEFAULT_MEAL.main)
  const [dessert, setDessert] = useState(DEFAULT_MEAL.dessert)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    await onAdd({ name: name.trim(), meal: { starter, main, dessert } })
    setName('')
    setStarter(DEFAULT_MEAL.starter)
    setMain(DEFAULT_MEAL.main)
    setDessert(DEFAULT_MEAL.dessert)
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
          <select name="participantStarter" value={starter} onChange={(e) => setStarter(e.target.value)} disabled={busy}>
            {STARTER_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Main
          <select name="participantMain" value={main} onChange={(e) => setMain(e.target.value)} disabled={busy}>
            {MAIN_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Dessert
          <select name="participantDessert" value={dessert} onChange={(e) => setDessert(e.target.value)} disabled={busy}>
            {DESSERT_CHOICES.map((option) => (
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
