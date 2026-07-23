<script setup>
import IconEmployee from '~/assets/icons/entity/employee.svg?component';
import IconHospital from '~/assets/icons/entity/hospital.svg?component';
import IconArrowLeft from '~/assets/icons/arrow/left.svg?component';
import IconArrowRight from '~/assets/icons/arrow/right.svg?component';

const model = defineModel({ type: Object, required: true })
const nearest = defineModel('nearest', { type: Array, required: true, default: () => [] })

const state = ref(model.value.employee_id ? 'employee' : 'hospital')
const meta = computed(() => {
  switch(state.value) {
    case 'hospital': return { title: 'Hospital Information' }
    case 'employee': return { title: 'Employee Information', footer: 'Nearest Hospital', icon: IconHospital }
    case 'nearest': return { title: `Nearest Hospital ${NearestLabel.value}`, footer: 'Employee Information', icon: IconEmployee }
    default: return {}
  }
})

const { fetchLogs } = useAPI()
const nearestState = ref(false)

const switchState = () => {
  switch(state.value) {
    case 'hospital': break
    case 'nearest': state.value = 'employee'; break
    case 'employee':
      state.value = 'nearest'
      nearestIndex.value = 0
      if (!nearestState.value) {
        fetchLogs('Nearest Hospitals', `Viewed nearest hospitals: ${model.value.name}`)
        nearestState.value = true
      }
      break
  }
}

const nearestIndex = ref(0)
const pagination = computed(() => {
  if (!nearest.value || nearest.value.length === 0) {
    return { prev: true, next: true }
  }

  const prev = nearestIndex.value == 0
  const next = nearestIndex.value == nearest.value.length - 1
  return{ prev, next }
})

const NearestSwitch = (action) => {
  switch(action) {
    case 'next': if (nearestIndex.value < nearest.value.length - 1) nearestIndex.value++; break
    case 'prev': if (nearestIndex.value > 0) nearestIndex.value--; break
  }
}

const NearestLabel = computed(() => {
  return `(${nearestIndex.value + 1} of ${nearest.value.length})`
})

const emit = defineEmits(['close'])

const options = {
  autoResize: true,
  withCopy: true,
  showLabel: true,
  disabled: true
}
</script>

<template>
  <BaseModal :title="meta.title" max-width="450px" @close="emit('close')">
    <template #content>
      <div class="information-content">
        <template v-if="state === 'employee'">
          <FeaturesEmployeePicture :src="model.picture_url" :alt="model.name" size="calc(var(--size-xxl) * 5)" :border="'var(--size-s)'" disabled />
          <BaseInputDefault v-model="model.name" label="Name" v-bind="options" />
          <BaseInputDefault v-model="model.employee_id" label="Employee ID" v-bind="options" />
          <BaseInputDefault v-model="model.position" label="Position" v-bind="options" />
          <BaseInputDefault v-if="model.department" v-model="model.department" label="Department" v-bind="options" />
          <BaseInputDefault v-model="model.email" label="Email" v-bind="options" />
          <BaseInputDefault v-model="model.phone" label="Phone Number" v-bind="options">
            <BaseButtonDirect state="whatsaap" :name="model.name" :value="model.phone" />
          </BaseInputDefault>
          <BaseInputTextArea v-model="model.address_primary" label="KTP Address" v-bind="options">
            <BaseButtonDirect v-if="model.coordinate_primary" state="google_maps" :name="model.name" :value="model.coordinate_primary" />
          </BaseInputTextArea>
          <BaseInputTextArea v-if="model.address_secondary" v-model="model.address_secondary" label="Domicile Address" v-bind="options">
            <BaseButtonDirect v-if="model.coordinate_secondary" state="google_maps" :name="model.name" :value="model.coordinate_secondary" />
          </BaseInputTextArea>
        </template>

        <template v-if="state === 'hospital'">
          <BaseInputDefault v-model="model.name" label="Hospital" v-bind="options" />
          <BaseInputDefault v-if="model.phone" v-model="model.phone" label="Phone Number" v-bind="options" />
          <BaseInputTextArea v-model="model.address" label="Address" v-bind="options">
            <BaseButtonDirect v-if="model.coordinate" state="google_maps" :name="model.name" :value="model.coordinate" />
          </BaseInputTextArea>
        </template>

        <template v-if="state === 'nearest' && nearest?.length > 0">
          <BaseInputDefault v-model="nearest[nearestIndex].name" label="Hospital" v-bind="options">
            <span>{{ nearest[nearestIndex].distance }} km</span>
          </BaseInputDefault>
          <BaseInputTextArea v-model="nearest[nearestIndex].address" label="Address" v-bind="options">
            <BaseButtonDirect v-if="nearest[nearestIndex].coordinate" state="google_maps" :name="nearest[nearestIndex].name" :value="nearest[nearestIndex].coordinate" />
          </BaseInputTextArea>
        </template>
      </div>
    </template>

    <template v-if="state !== 'hospital' && nearest?.length > 0" #footer>
      <div class="information-footer" :class="state">
        <div v-if="state === 'nearest'" class="pagination" :class="{ 'disabled': pagination.prev }" @click="NearestSwitch('prev')">
          <IconArrowLeft class="icon-arrow" />
          <span>Prev</span>
        </div>
        <div class="switch-state" :class="state" @click="switchState">
          <Component :is="meta.icon" class="icon-information"/>
          <span>{{ meta.footer }}</span>
        </div>
        <div v-if="state === 'nearest'" class="pagination" :class="{ 'disabled': pagination.next }" @click="NearestSwitch('next')">
          <span>Next</span>
          <IconArrowRight class="icon-arrow" />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.information-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: var(--size-m);
  padding: var(--size-m);
}

.information-content span {
  flex-shrink: 0;

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.information-footer {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.information-footer.nearest {
  justify-content: space-between;
}

.information-footer .pagination {
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: calc(var(--size-xxs) / 1.5);

  color: var(--grey-300);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.information-footer .pagination.disabled {
  cursor: default;
  color: var(--grey-200);
}

.information-footer .pagination:not(.disabled):hover {
  color: var(--warning-100);
}

.information-footer .pagination .icon-arrow {
  stroke-width: 1.25px;
}

.information-footer .switch-state {
  display: flex;
  align-items: center;
  gap: calc(var(--size-xs) / 1.25);

  cursor: pointer;
}

.information-footer .switch-state.employee {
  color: var(--danger-100);
}

.information-footer .switch-state.nearest {
  color: var(--primary-100);
}

.information-footer .pagination .icon-arrow,
.information-footer .switch-state .icon-information {
  width: var(--size-l);
  height: var(--size-l);
}

.information-footer .pagination span,
.information-footer .switch-state span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);
}

.information-footer .switch-state span:hover {
  text-decoration: underline;
}
</style>
