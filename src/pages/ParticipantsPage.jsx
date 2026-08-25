import { useEffect, useState } from 'react'
import { AddParticipantForm } from '../components/AddParticipantForm'
import { ParticipantCard } from '../components/ParticipantCard'
import { StatusMessage } from '../components/StatusMessage'
import {
  addParticipant,
  listParticipants,
  removeParticipant,
  updateParticipantMeal,
} from '../services/participantsService'

export function ParticipantsPage() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const loadParticipants = async () => {
    setError('')

    try {
      const result = await listParticipants()
      setParticipants(result)
    } catch {
      setError('Unable to load participants. Please check API connectivity.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParticipants()
  }, [])

  const withFeedback = async (action, successMessage) => {
    setBusy(true)
    setStatus('')
    setError('')

    try {
      await action()
      setStatus(successMessage)
    } catch {
      setError('The update did not complete. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleAdd = async ({ name, mealChoice }) => {
    await withFeedback(async () => {
      const created = await addParticipant(name, mealChoice)
      setParticipants((current) => [created, ...current])
    }, `${name} added to the list.`)
  }

  const handleMealChange = async (participantId, mealChoice) => {
    await withFeedback(async () => {
      const updated = await updateParticipantMeal(participantId, mealChoice)
      setParticipants((current) =>
        current.map((participant) => (participant.id === participantId ? updated : participant)),
      )
    }, 'Meal choice saved.')
  }

  const handleRemove = async (participantId) => {
    const participant = participants.find((item) => item.id === participantId)

    await withFeedback(async () => {
      await removeParticipant(participantId)
      setParticipants((current) => current.filter((item) => item.id !== participantId))
    }, `${participant?.name || 'Participant'} removed.`)
  }

  if (loading) {
    return <p className="loading">Loading participant list…</p>
  }

  return (
    <main className="participants-page">
      <AddParticipantForm onAdd={handleAdd} busy={busy} />
      <StatusMessage type="success">{status}</StatusMessage>
      <StatusMessage type="error">{error}</StatusMessage>

      <section className="participant-list" aria-live="polite">
        {participants.length === 0 ? (
          <article className="card empty-state">
            <h2>No participants yet</h2>
            <p>Add the first crew member to start meal planning.</p>
          </article>
        ) : (
          participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onMealChange={handleMealChange}
              onRemove={handleRemove}
              busy={busy}
            />
          ))
        )}
      </section>
    </main>
  )
}
