<script setup>
import { GoogleMap, AdvancedMarker, Circle } from 'vue3-google-map'

import UserMarker from '~/assets/icons/marker/user.svg?component';
import CenterMarker from '~/assets/icons/marker/center.svg?component';
import OfficeMarker from '~/assets/icons/marker/office.svg?component';
import EmployeeMarker from '~/assets/icons/marker/employee.svg?component';
import HospitalMarker from '~/assets/icons/marker/hospital.svg?component';

const config = useRuntimeConfig()

const app = useAppStore()
const { setGoogleMapState, setUserLocation, setFocus, clearFocus, office } = app
const { userLocation, center, radiusMeter, isUserLocation, isOffice, isHiddenCenter, focus } = storeToRefs(app)

const data = useDataStore()
const { setSelected } = data
const { selected, inRadiusEmployees, inRadiusHospitals } = storeToRefs(data)

const api = useAPI()
const { fetchLogs } = api

const zoom = ref(15)
const googleMapRef = ref(null)
const mapsOptions = computed(() => ({
  apiKey: config.public.googleApiKey,
  mapId: config.public.googleMapId,
  center: center.value,
  zoom: zoom.value,

  minZoom: 5,
  maxZoom: 20,
  clickableIcons: false,
  cameraControl: false,
  mapTypeControl: false,
  fullscreenControl: false
}))

const centerOptions = computed(() => ({
  center: center.value,
  radius: radiusMeter.value,
  fillColor: '#cceafc',
  strokeColor: '#0093EE',
  strokeWeight: 2,
  clickable: false,
}))

const moveCenter = (event) => {
  center.value = {
    lat: event?.lat || event.latLng?.lat(),
    lng: event?.lng || event.latLng?.lng()
  }
}

const onMapReady = () => {
  setGoogleMapState()

  setTimeout( async () =>  {
    await setUserLocation()
    const location = userLocation.value.address || 'Unknown Location'
    fetchLogs('Dynamic Maps', `Opened maps: ${location}`)
  }, 5000)
}

const getZIndex = (lat) => Math.round((90 - lat) * 1000)
const checkFocus = (id) => focus.value === id || selected.value?.id === id

watch(center, () => {
  if (googleMapRef.value && googleMapRef.value.map) {
    const currentZoom = googleMapRef.value.map.getZoom()
    if (currentZoom < 12.5) googleMapRef.value.map.setZoom(zoom.value)
  }
}, { deep: true })
</script>

<template>
  <GoogleMap ref="googleMapRef" class="google-maps" v-bind="mapsOptions" @click="moveCenter" @idle.once="onMapReady">
    <Circle :options="centerOptions" />
    <AdvancedMarker v-if="!isHiddenCenter" :options="{ position: center, zIndex: getZIndex(center.lat) }">
      <template #content>
        <div class="marker-wrapper">
          <CenterMarker class="marker center" />
        </div>
      </template>
    </AdvancedMarker>

    <AdvancedMarker :options="{ position: office, zIndex: getZIndex(office.lat) }" @click.stop="moveCenter(office)">
      <template #content>
        <div class="marker-wrapper" @mouseenter="setFocus(office.id)" @mouseleave="clearFocus()">
          <div class="tooltip">
            <span>PT Timah Industri</span>
          </div>
          <OfficeMarker class="marker office" :class="{ 'active': isOffice }" />
        </div>
      </template>
    </AdvancedMarker>

    <AdvancedMarker v-if="userLocation" :options="{ position: userLocation.coordinate, zIndex: getZIndex(userLocation.coordinate.lat) }" @click.stop="moveCenter(userLocation.coordinate)">
      <template #content>
        <div class="marker-wrapper" @mouseenter="setFocus(userLocation.id)" @mouseleave="clearFocus()">
          <div class="tooltip">
            <span>Your Location</span>
          </div>
          <UserMarker class="marker user" :class="{ 'active': isUserLocation }" />
        </div>
      </template>
    </AdvancedMarker>

    <AdvancedMarker v-for="employee in inRadiusEmployees" :key="employee.id" :options="{ position: employee.coordinate, zIndex: getZIndex(employee.coordinate.lat) }" @click.stop="setSelected(employee)">
      <template #content>
        <div class="marker-wrapper" :class="{ 'focus': checkFocus(employee.id) }" @mouseenter="setFocus(employee.id)" @mouseleave="clearFocus()">
          <div class="tooltip">
            <span>{{ employee.name }}</span>
            <span>{{ employee.position }}</span>
          </div>
          <EmployeeMarker class="marker employee" />
        </div>
      </template>
    </AdvancedMarker>

    <AdvancedMarker v-for="hospital in inRadiusHospitals" :key="hospital.id" :options="{ position: hospital.coordinate, zIndex: getZIndex(hospital.coordinate.lat) }" @click.stop="setSelected(hospital)">
      <template #content>
        <div class="marker-wrapper" :class="{ 'focus': checkFocus(hospital.id) }" @mouseenter="setFocus(hospital.id)" @mouseleave="clearFocus()">
          <div class="tooltip">
            <span>{{ hospital.name }}</span>
          </div>
          <HospitalMarker class="marker hospital" />
        </div>
      </template>
    </AdvancedMarker>
  </GoogleMap>
</template>

<style scoped>
.google-maps {
  width: 100%;
  height: 100dvh;
}

.marker-wrapper {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-wrapper .marker {
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
  transition: width var(--transition-normal) var(--transition-bounce),
              height var(--transition-normal) var(--transition-bounce);
}

.marker-wrapper .marker.center {
  width: var(--size-xxl);
  height: var(--size-xxl);

  position: absolute;
  transform: translateY(-50%);
}

.marker-wrapper .marker.office {
  width: calc(var(--size-xxl) * 2);
  height: calc(var(--size-xxl) * 2);
}

.marker-wrapper:hover .marker.office,
.marker-wrapper .marker.office.active {
  width: calc(var(--size-xxl) * 2.25);
  height: calc(var(--size-xxl) * 2.25);
}

.marker-wrapper .marker:is(.user, .employee, .hospital) {
  width: calc(var(--size-xxl) * 1.15);
  height: calc(var(--size-xxl) * 1.15);
}

.marker-wrapper:hover .marker.user,
.marker-wrapper .marker.user.active {
  width: calc(var(--size-xxl) * 1.75);
  height: calc(var(--size-xxl) * 1.75);
}

.marker-wrapper:hover .marker:is(.employee, .hospital),
.marker-wrapper.focus .marker:is(.employee, .hospital) {
  width: calc(var(--size-xxl) * 1.5);
  height: calc(var(--size-xxl) * 1.5);
}

.marker-wrapper .tooltip {
  position: absolute;
  bottom: calc(var(--size-xs) + 100%); left: 50%;
  transform: translateX(-50%) translateY(6px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: var(--size-xs);
  gap: calc(var(--size-xxs) / 2);
  border-radius: var(--size-xxs);

  opacity: 0;
  white-space: nowrap;
  pointer-events: none;

  background-color: var(--white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  transition: opacity var(--transition-fast) var(--transition-smooth),
              transform var(--transition-normal) var(--transition-bounce);
}

.marker-wrapper:hover .tooltip,
.marker-wrapper.focus .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.marker-wrapper .tooltip::after {
  content: '';
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%);

  border: 5px solid transparent;
  border-top-color: var(--white);
}

.marker-wrapper .tooltip span:nth-child(1) {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-semi-bold);

  color: var(--black);
}

.marker-wrapper .tooltip span:nth-child(2) {
  font-family: var(--font-primary);
  font-size: calc(var(--size-m) - 2px);
  font-weight: var(--font-medium);

  color: var(--grey-300);
}
</style>
