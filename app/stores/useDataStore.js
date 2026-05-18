import { useAPI } from '~/composables/useAPI';
import { filterByRadius, getNearest } from '~/utils/distanceHelper'
import { useAppStore } from '~/stores/useAppStore';


export const useDataStore = defineStore('data', () => {
  const { fetchData, fetchLogs } = useAPI()

  const me = ref(null);
  const initMe = async () => {
    const response = await fetchData('me')
    me.value = response
    return response
  }

  const employees = ref([]);
  const initEmployees = async () => {
    const response = await fetchData('employees')
    employees.value = Array.isArray(response) ? response : [response]
    return response
  }

  const hospitals = ref([]);
  const initHospitals = async () => {
    const response = await fetchData('hospitals')
    hospitals.value = response
    return response
  }

  const app = useAppStore()
  const { center, radiusMeter } = storeToRefs(app)
  const inRadiusHospitals = computed(() => filterByRadius(hospitals.value, center.value, radiusMeter.value))
  const inRadiusEmployees = computed(() => filterByRadius(employees.value, center.value, radiusMeter.value))

  const selected = ref(null);
  const setSelected = (data) => {
    setTimeout(() => { selected.value = data }, 50)
    if (data.employee_id) fetchLogs('Employee Information', `View Employee: ${data.name}`)
    else fetchLogs('Hospital Information', `View Hospital: ${data.name}`)
  }

  const clearSelected = () => selected.value = null
  const nearestHospital = computed(() => {
    if (!selected.value) return []

    let targetCoordinate = selected.value.coordinate
    return getNearest(hospitals.value, targetCoordinate)
  })

  return {
    me, initMe,
    employees, initEmployees,
    hospitals, initHospitals,
    inRadiusEmployees, inRadiusHospitals,
    selected, setSelected, clearSelected, nearestHospital
  };
})
