import { DESSERT_OPTIONS, MAIN_OPTIONS, STARTER_OPTIONS } from '../models/participant'

export function ParticipantCard({ participant, onMealChange, onRemove, busy }) {
  const starter = participant.starter ?? 'None'
  const main = participant.main ?? 'None'
  const dessert = participant.dessert ?? 'None'

  const handleChange = (field, value) => {
    onMealChange(participant.id, {
      starter: field === 'starter' ? value : starter,
      main: field === 'main' ? value : main,
      dessert: field === 'dessert' ? value : dessert,
    })
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
          <select
            value={starter}
            disabled={busy}
            onChange={(event) => handleChange('starter', event.target.value)}
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
            value={main}
            disabled={busy}
            onChange={(event) => handleChange('main', event.target.value)}
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
            value={dessert}
            disabled={busy}
            onChange={(event) => handleChange('dessert', event.target.value)}
          >
            {DESSERT_OPTIONS.map((option) => (
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
