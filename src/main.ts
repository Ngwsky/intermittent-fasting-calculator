import App from './App.svelte'
import { registerSW } from 'virtual:pwa-register'
import { register, init, getLocaleFromNavigator } from 'svelte-i18n'
import { get } from 'svelte/store'
import { preferences } from './stores/stores'

register('en', () => import('./i18n/en.json'))
register('ja', () => import('./i18n/ja.json'))
init({
  fallbackLocale: 'en',
  initialLocale: typeof get(preferences).locale !== "undefined" ? get(preferences).locale : getLocaleFromNavigator(),
})

export const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

const app = new App({
  target: document.getElementById('app')
})

export default app
