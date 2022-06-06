import App from './App.svelte'
import { registerSW } from 'virtual:pwa-register'
import { register, init, getLocaleFromNavigator } from 'svelte-i18n'

register('en', () => import('./i18n/en.json'))
register('ja', () => import('./i18n/ja.json'))
init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})

export const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

const app = new App({
  target: document.getElementById('app')
})

export default app
