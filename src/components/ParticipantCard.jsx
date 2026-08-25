import { MEAL_CHOICES } from '../models/participant'

export function ParticipantCard({ participant, onMealChange, onRemove, busy }) {
  return (
    <article className="card participant-card">
      <div>
        <h3>{participant.name}</h3>
        <p className="meta">Last updated {new Date(participant.updatedAt).toLocaleString()}</p>
      </div>
      <div className="participant-actions">
        <label>
          Meal choice
          <select
            value={participant.mealChoice}
            disabled={busy}
            onChange={(event) => onMealChange(participant.id, event.target.value)}
          >
            {MEAL_CHOICES.map((option) => (
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
