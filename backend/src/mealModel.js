// Meal choice validation — mirrors the frontend model.

export const STARTER_CHOICES = ['None', 'Soup', 'Prawn cocktail', 'Bruschetta']
export const MAIN_CHOICES = ['None', 'Chicken', 'Fish', 'Vegetarian pasta', 'Vegan curry']
export const DESSERT_CHOICES = ['None', 'Cheesecake', 'Ice cream', 'Fruit salad']

export const DEFAULT_MEAL = { starter: 'None', main: 'None', dessert: 'None' }

/**
 * Normalise raw meal fields — unknown values fall back to 'None'.
 * @param {{ starter?: string, main?: string, dessert?: string }} raw
 * @returns {{ starter: string, main: string, dessert: string }}
 */
export function normalizeMeal({ starter, main, dessert } = {}) {
  return {
    starter: STARTER_CHOICES.includes(starter) ? starter : 'None',
    main: MAIN_CHOICES.includes(main) ? main : 'None',
    dessert: DESSERT_CHOICES.includes(dessert) ? dessert : 'None',
  }
}
