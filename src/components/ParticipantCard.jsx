import { useState } from 'react'
import { DESSERT_CHOICES, MAIN_CHOICES, STARTER_CHOICES } from '../models/participant'

export function ParticipantCard({ participant, onMealChange, onRemove, busy }) {
  const [starter, setStarter] = useState(participant.starter ?? 'None')
  const [main, setMain] = useState(participant.main ?? 'None')
  const [dessert, setDessert] = useState(participant.dessert ?? 'None')

  const handleChange = (field, value) => {
    const next = { starter, main, dessert, [field]: value }
    if (field === 'starter') setStarter(value)
    if (field === 'main') setMain(value)
    if (field === 'dessert') setDessert(value)
    onMealChange(participant.id, next)
  }

  return (
    <article className="card participant-card">
      <div>
        <h3>{participant.name}</h3>
        <p className="meta">Last updated {new Date(participant.updatedAt).toLocaleString()}</p>
      </div>
      <div className="participant-actions">
        <label>
          Starter
          <select value={starter} disabled={busy} onChange={(e) => handleChange('starter', e.target.value)}>
            {STARTER_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Main
          <select value={main} disabled={busy} onChange={(e) => handleChange('main', e.target.value)}>
            {MAIN_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Dessert
          <select value={dessert} disabled={busy} onChange={(e) => handleChange('dessert', e.target.value)}>
            {DESSERT_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="button-danger" disabled={busy} onClick={() => onRemove(participant.id)}>
          Remove
        </button>
      </div>
    </article>
  )
}
