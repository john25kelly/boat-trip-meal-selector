/**
 * @typedef {'None'|'Soup'|'Prawn cocktail'|'Bruschetta'} StarterChoice
 * @typedef {'None'|'Chicken'|'Fish'|'Vegetarian pasta'|'Vegan curry'} MainChoice
 * @typedef {'None'|'Cheesecake'|'Ice cream'|'Fruit salad'} DessertChoice
 */

/**
 * @typedef {Object} MealSelection
 * @property {StarterChoice} starter
 * @property {MainChoice} main
 * @property {DessertChoice} dessert
 */

/**
 * @typedef {Object} Participant
 * @property {string} id
 * @property {string} name
 * @property {StarterChoice} starter
 * @property {MainChoice} main
 * @property {DessertChoice} dessert
 * @property {string} updatedAt
 */

export const STARTER_CHOICES = ['None', 'Soup', 'Prawn cocktail', 'Bruschetta']
export const MAIN_CHOICES = ['None', 'Chicken', 'Fish', 'Vegetarian pasta', 'Vegan curry']
export const DESSERT_CHOICES = ['None', 'Cheesecake', 'Ice cream', 'Fruit salad']

export const DEFAULT_MEAL = { starter: 'None', main: 'None', dessert: 'None' }
