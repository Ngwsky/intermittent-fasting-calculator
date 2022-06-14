import { writable } from './localStorageStore'

export const preferences = writable('preferences', {
  darkMode: undefined,
  locale: undefined,
})