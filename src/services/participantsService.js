import { DESSERT_OPTIONS, MAIN_OPTIONS, STARTER_OPTIONS } from '../models/participant'
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

function ensureStarter(value) {
  return STARTER_OPTIONS.includes(value) ? value : 'None'
}

function ensureMain(value) {
  return MAIN_OPTIONS.includes(value) ? value : 'None'
}

function ensureDessert(value) {
  return DESSERT_OPTIONS.includes(value) ? value : 'None'
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

export async function addParticipant(name, { starter = 'None', main = 'None', dessert = 'None' } = {}) {
  if (!USE_MOCK_API) {
    return apiRequest('/participants', {
      method: 'POST',
      body: JSON.stringify({ name, starter, main, dessert }),
    })
  }

  await delay()
  const participant = {
    id: `p-${crypto.randomUUID()}`,
    name,
    starter: ensureStarter(starter),
    main: ensureMain(main),
    dessert: ensureDessert(dessert),
    updatedAt: new Date().toISOString(),
  }

  mockParticipants = [participant, ...mockParticipants]
  return participant
}

export async function updateParticipantMeal(participantId, { starter, main, dessert }) {
  if (!USE_MOCK_API) {
    return apiRequest(`/participants/${participantId}/meal`, {
      method: 'PATCH',
      body: JSON.stringify({ starter, main, dessert }),
    })
  }

  await delay()
  mockParticipants = mockParticipants.map((participant) =>
    participant.id === participantId
      ? {
          ...participant,
          starter: ensureStarter(starter),
          main: ensureMain(main),
          dessert: ensureDessert(dessert),
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
