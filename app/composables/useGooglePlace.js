/* global google */
export const useGooglePlaces = (inputGetter, isReadyGetter, onSelect) => {
  const { fetchLogs } = useAPI()
  let instance = null
  let resizeObserver = null

  watchEffect(() => {
    if (!import.meta.client) return

    const el = inputGetter()
    const isReady = isReadyGetter()
    if (isReady && el instanceof HTMLInputElement && !instance) {
      instance = new google.maps.places.Autocomplete(el, {
        fields: ['name', 'geometry'],
        componentRestrictions: { country: 'id' },
      })

      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const inputWidth = entry.target.offsetWidth;
          document.documentElement.style.setProperty('--pac-width', `${inputWidth}px`);
        }
      })
      resizeObserver.observe(el)

      instance.addListener('place_changed', () => {
        const place = instance.getPlace()
        if (place.geometry?.location) {
          onSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          })
          fetchLogs('Place API (Search)', `Search location: ${place.name}`)
        }
      })
    }
  })

  onScopeDispose(() => {
    if (!import.meta.client) return

    if (instance) { google.maps.event.clearInstanceListeners(instance) }
    if (resizeObserver) { resizeObserver.disconnect() }

    const containers = document.querySelectorAll('.pac-container')
    containers.forEach(container => { container.remove() })
  })
}
