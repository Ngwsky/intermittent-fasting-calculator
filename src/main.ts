import App from './App.svelte'
import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

const app = new App({
  target: document.getElementById('app')
})

export default app
