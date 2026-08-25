import { useState } from 'react'
import { MEAL_CHOICES } from '../models/participant'

export function AddParticipantForm({ onAdd, busy }) {
  const [name, setName] = useState('')
  const [mealChoice, setMealChoice] = useState('No preference')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    await onAdd({ name: name.trim(), mealChoice })
    setName('')
    setMealChoice('No preference')
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
          Meal
          <select
            name="participantMeal"
            value={mealChoice}
            onChange={(event) => setMealChoice(event.target.value)}
            disabled={busy}
          >
            {MEAL_CHOICES.map((option) => (
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
