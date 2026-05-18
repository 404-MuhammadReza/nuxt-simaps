<script setup>
import IconAttachment from '~/assets/icons/attachment/default.svg?component';
import IconDocDownload from '~/assets/icons/document/download.svg?component';

import IconSuccess from '~/assets/icons/notification/success.svg?component';
import IconWarning from '~/assets/icons/notification/warning.svg?component';
import IconDanger from '~/assets/icons/notification/danger.svg?component';

import IconClose from '~/assets/icons/state/close.svg?component';

const props = defineProps({
  label: { type: String, required: true },
  desc: { type: String, default: null },
  icon: { type: Object, default: null },
  type: { type: Array, default: () => [] },
  maxSize: { type: Number, default: null },
  disabled: { type: Boolean, default: false },

  isLoading: { type: Boolean, default: false },
  result: { type: Object, default: null }
})

const model = defineModel({ type: File, default: null })
const emit = defineEmits(['report', 'reset'])

const errMessage = ref(null)
const setErr = (message) => {
  if (!message) {
    errMessage.value = null
    return
  }

  errMessage.value = message
}

const state = computed(() => {
  if (props.isLoading) return 'loading'
  if (errMessage.value) return 'danger'
  if (props.result) return props.result.status
  return 'idle'
})

const resultDisplay = computed(() => {
  if (state.value === 'loading') {
    return { icon: 'eos-icons:loading', title: 'Processing...', desc: 'Please wait a moment' }
  }
  if (state.value === 'danger' && errMessage.value) {
    return { icon: IconDanger, title: 'Upload Failed', desc: errMessage.value }
  }

  if (props.result) {
    let iconName = ''
    if (state.value === 'success') iconName = IconSuccess
    else if (state.value === 'warning') iconName = IconWarning
    else if (state.value === 'danger') iconName = IconDanger

    return {
      icon: iconName,
      title: props.result.title || props.label,
      desc: props.result.message || props.desc
    }
  }

  return { icon: '', title: '', desc: '' }
})

const dragState = ref(null)
const dropZoneRef = ref(null)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    if (props.disabled || props.isLoading || files?.length <= 0) return
    dragState.value = null
    processFile(files[0])
  },
  onEnter: (files, event) => {
    if (props.disabled || props.isLoading) return
    setErr()

    const items = event.dataTransfer.items
    if (items.length > 0) {
      const fileType = items[0].type
      const isInvalid = props.type.length > 0 && (!fileType || !props.type.includes(fileType))

      if (isInvalid) dragState.value = 'invalid'
      else dragState.value = 'valid'
    }
  },
  onLeave: () => { dragState.value = null }
})

const { open, onChange, reset: resetFileDialog } = useFileDialog({
  accept: props.type.length > 0 ? props.type.join(',') : '*',
  multiple: false
})

const handleClick = () => {
  if (props.disabled || props.isLoading) return
  setErr()
  open()
}

onChange((files) => {
  if (files?.length > 0) {
    processFile(files[0])
    resetFileDialog()
  }
})

const processFile = (file) => {
  if (props.disabled || props.isLoading) return

  if (props.type.length > 0 && !props.type.includes(file.type)) {
    setErr('File type not supported.')
    return
  }

  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    setErr(`File size exceeds the maximum limit of ${props.maxSize}MB.`)
    return
  }

  setErr()
  model.value = file
}

const handleReset = () => {
  model.value = null
  setErr()
  emit('reset')
}
</script>

<template>
  <div class="attachment-wrapper">
    <div v-if="state !== 'idle'" class="result-wrapper" :class="state">
      <Component :is="resultDisplay.icon" class="result-icon" />
      <div class="information">
        <span>{{ resultDisplay.title }}</span>
        <span v-if="resultDisplay.desc">{{ resultDisplay.desc }}</span>
      </div>

      <div v-if="state !== 'loading'" class="action-wrapper">
        <IconDocDownload
          v-if="props.result && state !== 'danger'"
          class="action-icon"
          @click="emit('report')"
        />
        <IconClose
          class="action-icon"
          @click="handleReset"
        />
      </div>
    </div>

    <div
      v-else
      ref="dropZoneRef"
      class="zone-wrapper"
      :class="[
        dragState === 'invalid' ? 'danger' : (isOverDropZone ? 'primary' : ''),
        props.disabled ? 'disabled' : ''
      ]"
      @click="handleClick"
    >
      <Component :is="icon || IconAttachment" class="icon-attachment" />
      <div class="information">
        <span>{{ dragState === 'invalid' ? 'Invalid File' : (isOverDropZone ? 'Drop File Here' : props.label) }}</span>
        <span v-if="props.desc || isOverDropZone">{{ dragState === 'invalid' ? 'File type not supported' : (isOverDropZone ? 'Release to upload' : props.desc) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attachment-wrapper {
  width: 100%;
  flex: 1;
}

.attachment-wrapper .zone-wrapper,
.attachment-wrapper .result-wrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: var(--size-xs);
  padding: var(--size-s);
  border-radius: var(--size-s);
  position: relative;

  transition: all var(--transition-normal) var(--transition-smooth);
}

.attachment-wrapper .zone-wrapper {
  cursor: pointer;
  background-color: var(--grey-50);
  border: 1px dashed var(--grey-200);
}

.attachment-wrapper .zone-wrapper.primary {
  border-color: var(--primary-100);
  background-color: var(--primary-50);
}

.attachment-wrapper .zone-wrapper.danger {
  border-color: var(--danger-100);
  background-color: var(--danger-50);
}

.attachment-wrapper .zone-wrapper.disabled {
  cursor: default;
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

.attachment-wrapper .zone-wrapper * {
  pointer-events: none;
}

.attachment-wrapper .result-wrapper.loading {
  border: 1px solid var(--primary-100);
  background-color: var(--primary-50);
}

.attachment-wrapper .result-wrapper.success {
  border: 1px solid var(--success-100);
  background-color: var(--success-50);
}

.attachment-wrapper .result-wrapper.warning {
  border: 1px solid var(--warning-100);
  background-color: var(--warning-50);
}

.attachment-wrapper .result-wrapper.danger {
  border: 1px solid var(--danger-100);
  background-color: var(--danger-50);
}

.attachment-wrapper .icon-attachment,
.attachment-wrapper .result-icon {
  width: calc(var(--size-xxl) * 2);
  height: calc(var(--size-xxl) * 2);
  stroke-width: 0.75px;

  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.attachment-wrapper .information {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-xxs);
}

.attachment-wrapper .information span {
  font-family: var(--font-primary);
  text-align: center;
  transition: color var(--transition-normal) var(--transition-smooth);
}

.attachment-wrapper .zone-wrapper .information span:nth-child(1) {
  font-size: var(--size-m);
  font-weight: var(--font-semi-bold);
  color: var(--black);
}

.attachment-wrapper .zone-wrapper .information span:nth-child(2) {
  font-size: var(--size-s);
  font-weight: var(--font-regular);
  color: var(--grey-300);
}

.attachment-wrapper .zone-wrapper.disabled .information span {
  color: var(--grey-200);
}

.attachment-wrapper .zone-wrapper.primary .icon-attachment,
.attachment-wrapper .result-wrapper.loading .result-icon,
.attachment-wrapper .zone-wrapper.primary .information span,
.attachment-wrapper .result-wrapper.loading .information span {
  color: var(--primary-100);
}

.attachment-wrapper .result-wrapper.success .result-icon,
.attachment-wrapper .result-wrapper.success .information span,
.attachment-wrapper .result-wrapper.success .action-wrapper .action-icon {
  color: var(--success-100);
}

.attachment-wrapper .result-wrapper.warning .result-icon,
.attachment-wrapper .result-wrapper.warning .information span {
  color: var(--warning-100);
}

.attachment-wrapper .zone-wrapper.danger .icon-attachment,
.attachment-wrapper .result-wrapper.danger .result-icon,
.attachment-wrapper .zone-wrapper.danger .information span,
.attachment-wrapper .result-wrapper.danger .information span {
  color: var(--danger-100);
}

.action-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-s);

  position: absolute;
  top: 12px;
  right: 12px;
}

.action-icon {
  width: var(--size-l);
  cursor: pointer;

  transition: transform var(--transition-normal) var(--transition-smooth);
}

.action-icon:hover {
  transform: scale(1.1);
}
</style>
