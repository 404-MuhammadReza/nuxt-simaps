import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { useAppStore } from '~/stores/useAppStore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { setGoogleState } = useAppStore()

  setOptions({
    key: config.public.googleApiKey,
    v: 'weekly'
  })

  Promise.all([
    importLibrary('maps'),
    importLibrary('places'),
    importLibrary('marker')
  ]).then(() => setGoogleState())
    .catch((error) => console.error('❌ Gagal me-load Google Maps API:', error))
})
