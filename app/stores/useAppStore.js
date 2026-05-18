import { useUserLocation } from '~/composables/useUserLocation';

export const useAppStore = defineStore('app', () => {
  const googleState = ref(false)
  const setGoogleState = () => {
    googleState.value = true;
  };

  const googleMapState = ref(false)
  const setGoogleMapState = () => {
    googleMapState.value = true;
  };

  const center = ref({ lat: -5.9972936, lng: 106.0154434 })
  const office = { lat: -5.9972936, lng: 106.0154434 }

  const { fetchAddress } = useAPI()
  const userLocation = ref(null)
  const setUserLocation = async () => {
    const coordinate = await useUserLocation()
    const address = await fetchAddress(coordinate)

    userLocation.value = { address, coordinate }
    center.value = coordinate || center.value
  };

  const isOffice = computed(() => center.value.lat === office.lat && center.value.lng === office.lng)
  const isUserLocation = computed(() => userLocation.value && center.value.lat === userLocation.value.coordinate.lat && center.value.lng === userLocation.value.coordinate.lng)
  const isHiddenCenter = computed(() => isOffice.value || isUserLocation.value);

  const radiusKM = ref(5)
  const radiusMeter = computed(() => radiusKM.value * 1000)

  const focus = ref(null);
  const setFocus = (data) => focus.value = data
  const clearFocus = () => setTimeout(() => { focus.value = null }, 50)

  const notification = ref([])

  const setNotification = (type, message, timeout = 5000) => {
    const id = Date.now();
    notification.value.push({ id, type, message })

    setTimeout(() => {
      notification.value = notification.value.filter((n) => n.id !== id)
    }, timeout)
  };

  return {
    googleState, setGoogleState, googleMapState, setGoogleMapState,
    center, office, userLocation, setUserLocation,
    isOffice, isUserLocation, isHiddenCenter,
    radiusKM, radiusMeter,
    focus, setFocus, clearFocus,
    notification, setNotification,
  };
});
