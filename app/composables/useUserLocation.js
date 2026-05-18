import { useAppStore } from "~/stores/useAppStore"

export const useUserLocation = () => {
  const { setNotification } = useAppStore()

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    },
    (err) => {
      setNotification('warning', 'Failed to get your location. Your location will be set to office.');
      console.warn("Failed to get location:", err.message);
      resolve(null);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  });
};
