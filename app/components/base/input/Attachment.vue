<script setup>
import IconAttachment from '~/assets/icons/attachment/default.svg?component';

const props = defineProps({
  variant: { type: String, default: null },
  label: { type: String, default: 'Click to upload or drag and drop' },
  desc: { type: String, default: 'Attach a file from your computer' },
  icon: { type: Object, default: null },
  type: { type: Array, default: () => [] },
  maxSize: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
})

const model = defineModel({ type: File, default: null })

const errMessage = ref(null)
const setErr = (message) => {
  if (!message) {
    errMessage.value = null
    return
  }

  errMessage.value = message
  setTimeout(() => { errMessage.value = null }, 5000)
}

const dragState = ref(null)
const dropZoneRef = ref(null)
const { isOverDropZone } = useDropZone(dropZoneRef , {
  onDrop: (files) => {
    if (props.disabled || files?.length <= 0) return
    dragState.value = null
    processFile(files[0])
  },
  onEnter: (files, event) => {
    if (props.disabled) return
    setErr()

    const items = event.dataTransfer.items
    if (items.length > 0) {
      const fileType = items[0].type
      if (props.type.length > 0 && (!fileType || !props.type.includes(fileType))) dragState.value = 'invalid'
      else dragState.value = 'valid'
    }
  },
  onLeave: () => { dragState.value = null }
})

const processFile = (file) => {
  if (props.disabled) return

  if (props.type.length > 0 && !props.type.includes(file.type)) {
    setErr('Invalid format. Please upload a supported file type')
    return
  }

  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    setErr(`File is too large. Please upload a file smaller than ${props.maxSize}MB`)
    return
  }

  setErr()
  model.value = file
}

const { open, onChange, reset } = useFileDialog({
  accept: props.type.length > 0 ? props.type.join(',') : '*',
  multiple: false
})

const handleClick = () => {
  if (props.disabled) return
  setErr()
  open()
}

onChange((files) => {
  if (files?.length > 0) {
    processFile(files[0])
    reset()
  }
})

const dropDisplay = computed(() => {
  if (isOverDropZone.value) {
    return {
      title: dragState.value === 'invalid' ? 'Unsupported file format' : 'Drop file to upload',
      desc: dragState.value === 'invalid' ? 'Please check the allowed file types' : 'Release your mouse to attach this file',
    }
  }

  if (errMessage.value) {
    return {
      title: 'Error uploading file',
      desc: errMessage.value,
    }
  }

  return {
    title: props.label,
    desc: props.desc,
  }
})

const dropClass = computed(() => {
  if (props.disabled) return 'disabled'
  if (isOverDropZone.value) return dragState.value === 'invalid' ? 'danger' : 'primary'
  if (errMessage.value) return ['danger', 'solid']
  if (props.variant) return [props.variant, 'solid']

  return null
})
</script>

<template>
  <div ref="dropZoneRef" class="attachment-wrapper" :class="dropClass" @click="handleClick">
    <Component :is="icon || IconAttachment" class="icon-attachment"/>
    <div class="information">
      <span>{{ dropDisplay.title }}</span>
      <span v-if="desc">{{ dropDisplay.desc }}</span>
    </div>
  </div>
</template>

<style scoped>
.attachment-wrapper {
  width: 100%;
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  gap: var(--size-xs);
  padding: var(--size-s);
  border-radius: var(--size-s);

  background-color: var(--grey-50);
  border: 1px dashed var(--grey-200);

  transition: border var(--transition-normal) var(--transition-smooth),
              background-color var(--transition-normal) var(--transition-smooth);
}

.attachment-wrapper.disabled {
  cursor: default;

  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

.attachment-wrapper.primary {
  border-color: var(--primary-100);
  background-color: var(--primary-50);
}

.attachment-wrapper.success {
  border-color: var(--success-100);
  background-color: var(--success-50);
}

.attachment-wrapper.warning {
  border-color: var(--warning-100);
  background-color: var(--warning-50);
}

.attachment-wrapper.danger {
  border-color: var(--danger-100);
  background-color: var(--danger-50);
}

.attachment-wrapper.solid {
  border-style: solid;
}

.attachment-wrapper * {
  pointer-events: none;
}

.attachment-wrapper .icon-attachment {
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

.attachment-wrapper .information span:nth-child(1) {
  font-size: var(--size-m);
  font-weight: var(--font-semi-bold);

  color: var(--black);
}

.attachment-wrapper .information span:nth-child(2) {
  font-size: var(--size-s);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.attachment-wrapper.disabled .information span {
  color: var(--grey-200);
}

.attachment-wrapper.primary .icon-attachment,
.attachment-wrapper.primary .information span {
  color: var(--primary-100);
}

.attachment-wrapper.success .icon-attachment,
.attachment-wrapper.success .information span {
  color: var(--success-100);
}

.attachment-wrapper.warning .icon-attachment,
.attachment-wrapper.warning .information span {
  color: var(--warning-100);
}

.attachment-wrapper.danger .icon-attachment,
.attachment-wrapper.danger .information span {
  color: var(--danger-100);
}
</style>
