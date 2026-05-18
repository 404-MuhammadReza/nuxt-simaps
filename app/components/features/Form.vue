<script setup>
import IconImage from '~/assets/icons/attachment/image.svg?component';
import IconExcel from '~/assets/icons/attachment/excel.svg?component';

const props = defineProps({
  entity: { type: String, required: true },
  state: { type: String, required: true },
  data: { type: Object, default: null },
  error: { type: Array, default: () => [] },

  loading: { type: Boolean, default: false },
  result: { type: Object, default: null }
})

const emit = defineEmits(['createMany', 'report', 'reset'])

const formData = ref({})
watchEffect(() => {
  if (props.state === 'create_many') { formData.value = { file: null } }
  else if (['view', 'update'].includes(props.state) && props.data) {
    formData.value = { ...props.data }
    if (props.entity === 'employee') {
      formData.value.draft_picture = null
      if (!props.data.address_secondary) {
        formData.value.address_secondary = ''
        formData.value.coordinate_secondary = { lat: '', lng: '' }
      }
    }
  }
  else {
    switch(props.entity) {
      case 'employee': formData.value = { name: '', employee_id: '', position: '', department: '', email: '', phone: '', address_primary: '', coordinate_primary: { lat: '', lng: '' }, address_secondary: '', coordinate_secondary: { lat: '', lng: '' }, draft_picture: null }; break
      case 'hospital': formData.value = { name: '', phone: '', address: '', coordinate: { lat: '', lng: '' } }; break
      default: formData.value = {}
    }
  }
})

const pictureChange = (state) => {
  if (state === 'upload' && formData.value.draft_picture) {
    const newUrl = URL.createObjectURL(formData.value.draft_picture)
    formData.value.picture_url = newUrl
    formData.value.remove_picture = false
  } else if (state === 'delete') {
    formData.value.draft_picture = null
    formData.value.picture_url = null
    formData.value.remove_picture = true
  }
}

const uploadExcel = async () => {
  if (!formData.value.file) return
  emit('createMany', formData.value.file)
}

const pictureOptions = {
  desc: 'Image files only with max size 1MB',
  icon: IconImage,
  type: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 1
}

const excelOptions = {
  desc: 'Excel files (.xlsx) only',
  icon: IconExcel,
  type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
}

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'super_admin' }
]

const getError = (field) => {
  if (!props.error || props.error.length === 0) return null
  const foundError = props.error.find(e => e.field === field)

  return foundError ? 'required' : null
}

defineExpose({ formData })
const isDisabled = computed(() => props.state === 'view')
</script>

<template>
  <div class="form-wrapper">
    <template v-if="state === 'create_many'">
      <div class="wrapper horizontal">
        <BaseInputAttachmentFeedback v-model="formData.file" v-bind="excelOptions" :is-loading="loading" :result="result" :disabled="isDisabled" @update:model-value="uploadExcel" @report="emit('report')" @reset="emit('reset')" />
      </div>
    </template>
    <template v-else>
      <template v-if="entity === 'employee'">
        <div class="wrapper horizontal">
          <FeaturesEmployeePicture size="calc(var(--size-xxl) * 5.5)" :border="'var(--size-s)'" :src="formData.picture_url" :alt="formData.name" :disabled="isDisabled" @click="pictureChange('delete')" />
          <BaseInputAttachment v-model="formData.draft_picture" v-bind="pictureOptions" :disabled="isDisabled" @update:model-value="pictureChange('upload')" />
        </div>
        <BaseInputDefault v-model="formData.name" label="Full Name" :disabled="isDisabled" required with-copy show-label>
          <span v-if="!isDisabled && getError('Name')" class="error-message">{{ getError('Name') }}</span>
        </BaseInputDefault>
        <div class="wrapper horizontal auto-adjust">
          <BaseInputDefault v-model="formData.employee_id" label="Employee ID" :disabled="isDisabled" required with-copy show-label>
            <span v-if="!isDisabled && getError('EmployeeID')" class="error-message">{{ getError('EmployeeID') }}</span>
          </BaseInputDefault>
          <BaseInputDefault v-model="formData.position" label="Position" :disabled="isDisabled" required with-copy show-label>
            <span v-if="!isDisabled && getError('Position')" class="error-message">{{ getError('Position') }}</span>
          </BaseInputDefault>
          <BaseInputDefault v-model="formData.department" label="Department" :disabled="isDisabled" with-copy show-label />
        </div>
        <div class="wrapper horizontal auto-adjust">
          <BaseInputDefault v-model="formData.email" label="Email" :disabled="isDisabled" required with-copy show-label>
            <span v-if="!isDisabled && getError('Email')" class="error-message">{{ getError('Email') }}</span>
          </BaseInputDefault>
          <BaseInputDefault v-model="formData.phone" label="Phone Number" :disabled="isDisabled" required with-copy show-label>
            <span v-if="!isDisabled && getError('Phone')" class="error-message">{{ getError('Phone') }}</span>
            <BaseButtonDirect v-else-if="isDisabled" state="whatsaap" :name="formData.name" :value="formData.phone" />
          </BaseInputDefault>
        </div>
        <div class="wrapper horizontal auto-adjust">
          <div class="wrapper vertical">
            <BaseInputTextArea v-model="formData.address_primary" label="KTP Address" :disabled="isDisabled" required with-copy show-label>
              <span v-if="!isDisabled && getError('AddressPrimary')" class="error-message">{{ getError('AddressPrimary') }}</span>
              <BaseButtonDirect v-else-if="isDisabled && formData.address_primary" state="google_maps" :name="formData.name" :value="formData.coordinate_primary" />
            </BaseInputTextArea>
            <div class="wrapper horizontal auto-adjust">
              <BaseInputDefault v-model="formData.coordinate_primary.lat" label="KTP Latitude" :disabled="isDisabled" with-copy show-label />
              <BaseInputDefault v-model="formData.coordinate_primary.lng" label="KTP Longitude" :disabled="isDisabled" with-copy show-label />
            </div>
          </div>
          <div class="wrapper vertical">
            <BaseInputTextArea v-model="formData.address_secondary" label="KTP Domicile" :disabled="isDisabled" with-copy show-label>
              <BaseButtonDirect v-if="isDisabled && formData.address_secondary" state="google_maps" :name="formData.name" :value="formData.coordinate_secondary" />
            </BaseInputTextArea>
            <div class="wrapper horizontal auto-adjust">
              <BaseInputDefault v-model="formData.coordinate_secondary.lat" label="Domicile Latitude" :disabled="isDisabled" with-copy show-label />
              <BaseInputDefault v-model="formData.coordinate_secondary.lng" label="Domicile Longitude" :disabled="isDisabled" with-copy show-label />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="entity === 'hospital'">
        <BaseInputDefault v-model="formData.name" label="Hospital Name" :disabled="isDisabled" required with-copy show-label>
          <span v-if="!isDisabled && getError('Name')" class="error-message">{{ getError('Name') }}</span>
        </BaseInputDefault>
        <BaseInputDefault v-model="formData.phone" label="Phone Number" :disabled="isDisabled" with-copy show-label>
          <BaseButtonDirect v-if="isDisabled && formData.phone" state="whatsaap" :name="formData.name" :value="formData.phone" />
        </BaseInputDefault>
        <BaseInputTextArea v-model="formData.address" label="Address" :disabled="isDisabled" required with-copy show-label>
          <span v-if="!isDisabled && getError('Address')" class="error-message">{{ getError('Address') }}</span>
          <BaseButtonDirect v-if="isDisabled" state="google_maps" :name="formData.name" :value="formData.coordinate" />
        </BaseInputTextArea>
        <div class="wrapper horizontal auto-adjust">
          <BaseInputDefault v-model="formData.coordinate.lat" label="Latitude" :disabled="isDisabled" with-copy show-label />
          <BaseInputDefault v-model="formData.coordinate.lng" label="Longitude" :disabled="isDisabled" with-copy show-label />
        </div>
      </template>

      <template v-else-if="entity === 'user'">
        <div class="wrapper horizontal auto-adjust">
          <BaseInputDefault v-model="formData.name" label="Name" disabled with-copy show-label />
          <BaseInputSelect v-model="formData.role" label="Role" :options="roleOptions" :disabled="isDisabled" with-copy show-label />
        </div>
        <div class="wrapper vertical">
          <BaseInputDefault v-model="formData.email" label="Email" disabled with-copy show-label />
          <BaseInputDefault v-model="formData.microsoft_id" label="Microsoft ID" disabled with-copy show-label />
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.form-wrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  padding: var(--size-m);
  gap: var(--size-m);
}

.form-wrapper span.error-message {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--danger-100);
}

.form-wrapper .wrapper {
  width: 100%;

  display: flex;
  gap: var(--size-m);
}

.form-wrapper .wrapper.horizontal {
  flex-direction: row;
}

.form-wrapper .wrapper.vertical {
  flex-direction: column;
}

@media (max-width: 768px) {
  .form-wrapper .wrapper.horizontal.auto-adjust {
    flex-direction: column;
  }
}
</style>
