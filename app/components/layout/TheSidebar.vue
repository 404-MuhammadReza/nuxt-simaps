<script setup>
import TimahIndustri from '~/assets/logo/timah-industri.svg?component';

import IconSidebar from '~/assets/icons/sidebar/toggle-close.svg?component';
import IconSearch from '~/assets/icons/general/search.svg?component';

import IconEmergency from '~/assets/icons/state/emergency.svg?component';
import IconSetting from '~/assets/icons/state/setting.svg?component';
import IconLogout from '~/assets/icons/state/logout.svg?component';

const app = useAppStore()
const { googleState, center, radiusKM } = storeToRefs(app)

const query = ref('');
const isEmployeeMode = ref(false)
const placeSearchRef = ref(null)
const employeeSearchRef = ref(null)

useGooglePlaces(
  () => placeSearchRef.value?.input,
  () => googleState.value,
  (location) => center.value = location
)

watch(query, async (newQuery) => {
  if (!isAdmin.value) return
  if (newQuery.startsWith('@') && !isEmployeeMode.value) {
    isEmployeeMode.value = true
    await nextTick()
    if (employeeSearchRef.value?.focus) employeeSearchRef.value.focus()
  }

  else if (!newQuery.startsWith('@') && isEmployeeMode.value) {
    isEmployeeMode.value = false
    await nextTick()
    if (placeSearchRef.value?.input) placeSearchRef.value.input.focus()
  }
})

const { fetchLogs } = useAPI()
const data = useDataStore()
const { setSelected } = data
const { me, employees, inRadiusEmployees, inRadiusHospitals } = storeToRefs(data)
const isAdmin = computed(() => ['admin', 'super_admin'].includes(me.value?.role))

const handleSearchSelect = (employee) => {
  const coordinate = employee.coordinate_secondary || employee.coordinate_primary
  if (coordinate.lat && coordinate.lng) center.value = coordinate

  query.value = '';
  isEmployeeMode.value = false;
  fetchLogs('Search Employee', `Search employee: ${employee.name}`)
}

const inRadiusData = computed(() => {
  if (['admin', 'super_admin'].includes(me.value?.role)) {
    return inRadiusEmployees.value
  }

  else return inRadiusHospitals.value
})

const logout = async () => {
  try {
    await useCustomFetch("/api/auth/logout", { method: "POST" })
    navigateTo("/auth")
  } catch {
    const session = useCookie('session_simaps')
    session.value = null
    navigateTo("/auth")
  }
}

const searchPlaceHolder = computed(() => {
  if (isAdmin.value) return "Type '@' to search employees..."
  else return "Search places..."
})

const footer = computed(() => {
  const employeeCount = employees.value.length
  const hospitalCount = inRadiusHospitals.value.length
  const inRadiusCount = inRadiusData.value.length

  if (['admin', 'super_admin'].includes(me.value?.role)) {
    if (inRadiusCount === 0) return 'No employees in radius'
    else return `${inRadiusCount} from ${employeeCount} employees in radius`
  }
  else {
    if (inRadiusCount === 0) return 'No hospitals in radius'
    else return `${inRadiusCount} from ${hospitalCount} hospitals in radius`
  }
})

const emit = defineEmits(['toggle-sidebar', 'toggle-setting', 'toggle-emergency']);
</script>

<template>
  <div class="sidebar-container">
    <header>
      <TimahIndustri id="timah-industri" />
      <div class="menu-wrapper">
        <BaseButtonIcon
          variant="primary"
          label="Hide Sidebar"
          position="bottom"
          :icon="IconSidebar"
          show-tooltip
          @click="emit('toggle-sidebar')"
        />
        <BaseButtonIcon
          variant="danger"
          label="Emergency Contact"
          position="bottom"
          :icon="IconEmergency"
          show-tooltip
          @click="emit('toggle-emergency')"
        />
        <BaseButtonIcon
          v-if="isAdmin"
          variant="warning"
          label="Settings"
          position="bottom"
          :icon="IconSetting"
          show-tooltip
          @click="emit('toggle-setting')"
        />
        <BaseButtonIcon
          variant="danger"
          label="Logout"
          position="bottom"
          :icon="IconLogout"
          show-tooltip
          @click="logout"
        />
      </div>
    </header>
    <div class="action-wrapper">
      <BaseInputDefault
        v-show="!isEmployeeMode"
        ref="placeSearchRef"
        v-model="query"
        label="Search Employee"
        :icon="IconSearch"
        :placeholder="searchPlaceHolder"
      />
      <FeaturesEmployeeSearch
        v-show="isEmployeeMode"
        ref="employeeSearchRef"
        v-model="query"
        :employees="employees"
        @click="handleSearchSelect"
      />
      <BaseInputSlider
        v-model="radiusKM"
        label="Radius"
        :min="1"
        :max="100"
        :unit="'km'"
        show-label
        show-range
      />
    </div>
    <div class="inradius-wrapper">
      <FeaturesInRadiusList
        :data="inRadiusData"
        @click="setSelected"
      />
    </div>
    <footer>
      <span>{{ footer }}</span>
    </footer>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  border-radius: var(--size-m);

  background-color: var(--white);
  box-shadow: var(--shadow);
}

.sidebar-container header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--size-m);
  border-bottom: 1px solid var(--grey-200);
}

.sidebar-container header #timah-industri {
  width: calc(var(--size-xl) * 4);
  height: auto;
  flex-shrink: 0;
}

.sidebar-container header .menu-wrapper {
  display: flex;
  gap: var(--size-xxs);
}

.sidebar-container .action-wrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: var(--size-xs);

  padding: var(--size-m);
}

.sidebar-container .inradius-wrapper {
  width: 100%;
  flex: 1;

  overflow: hidden;
  padding: 0 var(--size-m);
}

.sidebar-container footer {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--size-m);
}

.sidebar-container footer span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}
</style>

<style>
.pac-container.pac-logo.hdpi {
  width: var(--pac-width) !important;
  margin-top: var(--size-xxs);
  border-radius: var(--size-xs);

  background-color: var(--white);
  border: 1px solid var(--grey-200);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.pac-container.pac-logo.hdpi:after {
  display: none;
}

.pac-container.pac-logo.hdpi .pac-item {
  cursor: pointer;
  padding: var(--size-xxs);
  border-top: 1px solid var(--grey-200);
}

.pac-container.pac-logo.hdpi .pac-item:first-child {
  border-top: none;
}

.pac-container.pac-logo.hdpi .pac-item:hover {
  background-color: var(--grey-100);
}

.pac-container.pac-logo.hdpi .pac-item span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.pac-container.pac-logo.hdpi .pac-item .pac-item-query span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-bold);

  color: var(--black);
}
</style>
