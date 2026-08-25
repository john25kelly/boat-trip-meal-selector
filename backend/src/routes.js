/**
 * Express router — /participants REST endpoints.
 */

import { Router } from 'express'
import { normalizeMeal } from './mealModel.js'
import * as participants from './participantsService.js'

const router = Router()

// GET /participants
router.get('/', async (_req, res, next) => {
  try {
    const list = await participants.list()
    res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST /participants
router.post('/', async (req, res, next) => {
  try {
    const { name, starter, main, dessert } = req.body ?? {}
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' })
    }
    const participant = await participants.add(name.trim(), normalizeMeal({ starter, main, dessert }))
    res.status(201).json(participant)
  } catch (err) {
    next(err)
  }
})

// PATCH /participants/:id/meal
router.patch('/:id/meal', async (req, res, next) => {
  try {
    const { id } = req.params
    const { starter, main, dessert } = req.body ?? {}
    const updated = await participants.updateMeal(id, normalizeMeal({ starter, main, dessert }))
    if (!updated) {
      return res.status(404).json({ error: 'Participant not found' })
    }
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /participants/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const removed = await participants.remove(id)
    if (!removed) {
      return res.status(404).json({ error: 'Participant not found' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
