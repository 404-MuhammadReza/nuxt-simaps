<script setup>
import IconSearch from '~/assets/icons/general/search.svg?component';
import IconDelete from '~/assets/icons/general/delete.svg?component';

import IconDocsAdd from '~/assets/icons/document/add.svg?component';
import IconDocsUpdate from '~/assets/icons/document/update.svg?component';
import IconDocsDownload from '~/assets/icons/document/download.svg?component';
import IconDocsDiscard from '~/assets/icons/document/discard.svg?component';

const data = useDataStore()
const { me, employees, hospitals } = storeToRefs(data)

const app = useAppStore()
const { setNotification } = app

const api = useAPI()
const { badRequest, loading, result, fetchUsage, fetchSubmit, fetchDelete,  fetchExcel, fetchExport, fetchTemplate, resetResult, fetchReport } = api

await Promise.all([
  refreshNuxtData('me'),
  refreshNuxtData('employees'),
  refreshNuxtData('hospitals')
])

const [{ data: users }, { data: usage }] = await Promise.all([
  useAsyncData('users', () => {
    if (me.value?.role !== 'super_admin') return []
    return useCustomFetch("/api/admin/users")
  }),
  useAsyncData('usage', () => {
    if (me.value?.role !== 'super_admin') return []
    return useCustomFetch("/api/admin/logs")
  })
])

const usageDetails = ref([])
const usagePayload = ref({})
const setUsageDetails = async (feature) => {
  if (feature) {
    const { start_date, end_date } = formatRange()
    usagePayload.value = { feature, start_date, end_date }

    await getUsageDetails()
    switchTab('usageDetails')
  } else {
    usagePayload.value = {}
    usageDetails.value = []
  }
}

const activeTab = ref('employee')
const switchTab = (tab) => {
  if (tab !== 'usageDetails' && usagePayload.value.feature) setUsageDetails()
  if (['create', 'update'].includes(activeState.value)) {
    setNotification('warning', 'Please save or discard them before switching tab')
    return
  }

  activeTab.value = tab
  setState('home')
}

const dataState = ref(null)
const activeData = computed(() => {
  switch (activeTab.value) {
    case 'employee': return employees.value || []
    case 'hospital': return hospitals.value || []
    case 'user': return users.value || []
    case 'usage': return usage.value || []
    case 'usageDetails': return usageDetails.value || []
    default: return []
  }
})

const activeState = ref('home')
const setState = (state, data = null) => {
  if (activeTab.value === 'usage' && state === 'view' && data?.feature) {
    setUsageDetails(data.feature)
    return
  }

  if (state === 'discard') {
    activeState.value = activeState.value === 'update' ? 'view' : 'home'
    if (result.value) resetResult()
    if (badRequest.value?.length > 0) badRequest.value = []
    if (activeState.value === 'home') dataState.value = null
    return
  }

  activeState.value = state
  if (state === 'view' && data) dataState.value = data
  else if (state === 'home') dataState.value = null
}

const getUsageDetails = async () => {
  if (!usagePayload.value.feature) return
  const result = await fetchUsage(usagePayload.value)
  if (result) usageDetails.value = result
}

const formRef = ref(null)
const handleSubmit = async () => {
  if (!formRef.value || !formRef.value.formData) return
  const result = await fetchSubmit(activeTab.value, formRef.value.formData, activeState.value)
  if (result) setState('view', result)
}

const handleCreateMany = async (file) => {
  await fetchExcel(activeTab.value, file)
}

const handleDelete = async () => {
  if (!activeTab.value || !dataState.value) return
  const result = await fetchDelete(activeTab.value, dataState.value.id)
  if (result) setState('home')
}

const handleTemplate = async () => {
  if (!activeTab.value) return
  await fetchTemplate(activeTab.value)
}

const handleExport = async () => {
  if (activeTab.value !== 'employee' && activeTab.value !== 'hospital') return
  await fetchExport(activeTab.value)
}

const handleReport = async (message) => {
  await fetchReport(activeTab.value, message)
}

const query = ref('')
const tableLength = ref(0)
const dataLength = computed(() => activeData.value?.length || 0)

const footer = computed(() => {
  if (activeTab.value === 'usageDetails') return `Showing ${dataLength.value} detailed logs`
  else if (dataLength.value === 0) return `No ${activeTab.value} found`
  else if (dataLength.value === tableLength.value) return `Total ${dataLength.value} ${activeTab.value}`
  else return `Showing ${tableLength.value} of ${dataLength.value} ${activeTab.value}`
})

const emit = defineEmits(['close'])

</script>

<template>
  <BaseModal @close="emit('close')">
    <template #header>
      <div class="setting-header">
        <template v-if="['admin', 'super_admin'].includes(me.role)">
          <span :class="{ 'active': activeTab === 'employee' }" @click="switchTab('employee')">Employees</span>
          <span :class="{ 'active': activeTab === 'hospital' }" @click="switchTab('hospital')">Hospitals</span>
        </template>
        <template v-if="me.role === 'super_admin'">
          <span :class="{ 'active': activeTab === 'user' }" @click="switchTab('user')">Users</span>
          <span :class="{ 'active': ['usage', 'usageDetails'].includes(activeTab) }" @click="switchTab('usage')">Application Usage</span>
        </template>
      </div>
    </template>

    <template #toolbox>
      <div class="setting-toolbox" :class="{ 'search': activeTab !== 'usageDetails' && activeState === 'home' }">
        <div class="left">
          <template v-if="activeState === 'home' && activeTab !== 'usageDetails'">
            <BaseInputDefault v-model="query" label="Search" variant="white" :icon="IconSearch" :placeholder="`Search ${activeTab}...`" />
          </template>
          <template v-else-if="['view', 'update'].includes(activeState) && dataState">
            <span>{{ dataState?.name }}</span>
            <span>{{ formatLastUpdate(dataState.updated_at) }}</span>
          </template>
          <template v-else-if="['create', 'create_many'].includes(activeState)">
            <span>{{ `Create New ${activeTab}` }}</span>
            <div v-if="activeState === 'create'" class="switch-wrapper">
              <span>{{ `Want to add multiple ${activeTab}s?`}}</span>
              <span @click="setState('create_many')">use Excel to do it all at once</span>
            </div>
            <div v-if="activeState=== 'create_many'" class="switch-wrapper">
              <span>{{ `Only adding one ${activeTab}?` }}</span>
              <span @click="setState('create')">using the form is faster</span>
            </div>
          </template>
          <template v-else-if="activeState === 'home' && activeTab === 'usageDetails'">
            <span>{{ usagePayload.feature }}</span>
            <div class="switch-wrapper">
              <span>Viewing detailed usage logs.</span>
              <span @click="switchTab('usage')">back to summary</span>
            </div>
          </template>
        </div>
        <div class="right">
          <template v-if="['employee', 'hospital'].includes(activeTab) && activeState === 'home'">
            <BaseButtonDefault variant="warning" :label="`Export ${ activeTab }`" :icon="IconDocsDownload" @click="handleExport" />
            <BaseButtonDefault variant="primary" :label="`Add ${ activeTab }`" :icon="IconDocsAdd" @click="setState('create')" />
          </template>
          <template v-else-if="activeState === 'view'">
            <BaseButtonDefault v-if="dataState?.id !== me.id" variant="warning" :label="`Update ${ activeTab }`" :icon="IconDocsUpdate" @click="setState('update')" />
            <BaseButtonConfirm v-if="activeTab !== 'user'" variant="danger" :label="`Delete ${ activeTab }`" confirm-label="Want to delete this?" :icon="IconDelete" @click="handleDelete" />
          </template>
          <template v-else-if="['create', 'update'].includes(activeState)">
            <BaseButtonDefault variant="primary" :label="`Save ${ activeTab }`" :icon="IconDocsAdd" @click="handleSubmit" />
            <BaseButtonConfirm variant="danger" :label="'Discard Changes'" confirm-label="Discard unsaved changes?" :icon="IconDocsDiscard" @click="setState('discard')"/>
          </template>
          <template v-else-if="activeState === 'create_many'">
            <BaseButtonDefault variant="primary" label="Download Template" :icon="IconDocsDownload" @click="handleTemplate" />
          </template>
          <template v-else-if="activeTab === 'usageDetails' && activeState === 'home'">
            <BaseInputDate v-model:start="usagePayload.start_date" v-model:end="usagePayload.end_date" label="Detail Range" @update:start="getUsageDetails" @update:end="getUsageDetails" />
          </template>
        </div>
      </div>
    </template>

    <template #content>
      <div class="setting-content">
        <FeaturesTable v-if="activeState === 'home'" :entity="activeTab" :data="activeData" :query="query" :disabled="activeTab === 'usageDetails'" @row-click="setState('view', $event)" @update-length="tableLength = $event" />
        <FeaturesForm v-else ref="formRef" :entity="activeTab" :state="activeState" :data="dataState" :error="badRequest" :loading="loading" :result="result" @create-many="handleCreateMany" @report="handleReport" @reset="resetResult" />
      </div>
    </template>

    <template v-if="activeState === 'home'" #footer>
      <div class="setting-footer">
        <span>{{ footer }}</span>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.setting-header {
  display: flex;
  justify-content: center;
  gap: var(--size-l);

  overflow: hidden;
}

.setting-header span {
  position: relative;
  display: block;

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-semi-bold);

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  cursor: pointer;
  color: var(--grey-300);

  transition: color var(--transition-normal) var(--transition-smooth);
}

.setting-header span:hover,
.setting-header span.active {
  color: var(--primary-100);
}

.setting-toolbox {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-m);
}

.setting-toolbox .left {
  display: flex;
  flex-direction: column;
  gap: calc(var(--size-xxs) / 2);
}

.setting-toolbox .left .switch-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-xxs);
}

.setting-toolbox.search .left {
  width: 100%;
  max-width: 300px;
}

.setting-toolbox .left > span:nth-child(1) {
  font-family: var(--font-primary);
  font-size: var(--size-l);
  font-weight: var(--font-medium);
  text-transform: capitalize;

  color: var(--black);
}

.setting-toolbox .left > span:nth-child(2) {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.setting-toolbox .left .switch-wrapper span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.setting-toolbox .left .switch-wrapper span:last-child {
  cursor: pointer;
  color: var(--primary-100);
}

.setting-toolbox .left .switch-wrapper span:last-child:hover {
  text-decoration: underline;
}

.setting-toolbox .right {
  display: flex;
  align-items: center;
  gap: var(--size-xs);
}

.setting-content {
  width: 100%;
}

.setting-footer {
  width: 100%;

  display: flex;
  justify-content: flex-end;
}

.setting-footer span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

@media (max-width: 768px) {
  .setting-toolbox {
    flex-direction: column;
    align-items: start;
  }

  .setting-toolbox .left {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .setting-toolbox .left .switch-wrapper {
    flex-direction: column;
    align-items: end;
  }

  .setting-toolbox .left .switch-wrapper span {
    text-align: right;
  }

  .setting-toolbox.search .left {
    max-width: none;
  }

  .setting-toolbox .right {
    flex-direction: row;
    width: 100%;
  }

  .setting-toolbox .right:not(:has(*)) {
    display: none;
  }

  .setting-toolbox .right :deep(button) {
    flex: 1;
  }
}
</style>
