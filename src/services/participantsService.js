import { MEAL_CHOICES } from '../models/participant'
import { apiRequest } from './apiClient'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

let mockParticipants = [
  {
    id: 'p-1',
    name: 'Skipper Sam',
    mealChoice: 'Fish',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-2',
    name: 'Deckhand Aileen',
    mealChoice: 'Vegetarian',
    updatedAt: new Date().toISOString(),
  },
]

function ensureMealChoice(mealChoice) {
  return MEAL_CHOICES.includes(mealChoice) ? mealChoice : 'No preference'
}

function delay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 250)
  })
}

export async function listParticipants() {
  if (!USE_MOCK_API) {
    return apiRequest('/participants')
  }

  await delay()
  return [...mockParticipants]
}

export async function addParticipant(name, mealChoice = 'No preference') {
  if (!USE_MOCK_API) {
    return apiRequest('/participants', {
      method: 'POST',
      body: JSON.stringify({ name, mealChoice }),
    })
  }

  await delay()
  const participant = {
    id: `p-${crypto.randomUUID()}`,
    name,
    mealChoice: ensureMealChoice(mealChoice),
    updatedAt: new Date().toISOString(),
  }

  mockParticipants = [participant, ...mockParticipants]
  return participant
}

export async function updateParticipantMeal(participantId, mealChoice) {
  if (!USE_MOCK_API) {
    return apiRequest(`/participants/${participantId}/meal`, {
      method: 'PATCH',
      body: JSON.stringify({ mealChoice }),
    })
  }

  await delay()
  const normalizedMealChoice = ensureMealChoice(mealChoice)
  mockParticipants = mockParticipants.map((participant) =>
    participant.id === participantId
      ? {
          ...participant,
          mealChoice: normalizedMealChoice,
          updatedAt: new Date().toISOString(),
        }
      : participant,
  )

  return mockParticipants.find((participant) => participant.id === participantId)
}

export async function removeParticipant(participantId) {
  if (!USE_MOCK_API) {
    await apiRequest(`/participants/${participantId}`, {
      method: 'DELETE',
    })
    return
  }

  await delay()
  mockParticipants = mockParticipants.filter((participant) => participant.id !== participantId)
}
