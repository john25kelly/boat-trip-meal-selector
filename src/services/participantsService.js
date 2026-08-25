import { DEFAULT_MEAL, DESSERT_CHOICES, MAIN_CHOICES, STARTER_CHOICES } from '../models/participant'
import { apiRequest } from './apiClient'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

let mockParticipants = [
  {
    id: 'p-1',
    name: 'Skipper Sam',
    starter: 'Soup',
    main: 'Fish',
    dessert: 'None',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p-2',
    name: 'Deckhand Aileen',
    starter: 'None',
    main: 'Vegetarian pasta',
    dessert: 'Cheesecake',
    updatedAt: new Date().toISOString(),
  },
]

function normalizeMeal({ starter, main, dessert } = {}) {
  return {
    starter: STARTER_CHOICES.includes(starter) ? starter : 'None',
    main: MAIN_CHOICES.includes(main) ? main : 'None',
    dessert: DESSERT_CHOICES.includes(dessert) ? dessert : 'None',
  }
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

export async function addParticipant(name, meal = DEFAULT_MEAL) {
  if (!USE_MOCK_API) {
    return apiRequest('/participants', {
      method: 'POST',
      body: JSON.stringify({ name, ...normalizeMeal(meal) }),
    })
  }

  await delay()
  const participant = {
    id: `p-${crypto.randomUUID()}`,
    name,
    ...normalizeMeal(meal),
    updatedAt: new Date().toISOString(),
  }

  mockParticipants = [participant, ...mockParticipants]
  return participant
}

export async function updateParticipantMeal(participantId, meal) {
  if (!USE_MOCK_API) {
    return apiRequest(`/participants/${participantId}/meal`, {
      method: 'PATCH',
      body: JSON.stringify(normalizeMeal(meal)),
    })
  }

  await delay()
  const normalized = normalizeMeal(meal)
  mockParticipants = mockParticipants.map((participant) =>
    participant.id === participantId
      ? {
          ...participant,
          ...normalized,
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
