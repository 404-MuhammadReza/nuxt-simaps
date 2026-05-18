<script setup>
import IconDocDownload from '~/assets/icons/document/download.svg?component';
import IconClose from '~/assets/icons/state/close.svg?component';

import IconLoading from '~/assets/icons/general/loading.svg?component';
import IconSuccess from '~/assets/icons/notification/success.svg?component';
import IconWarning from '~/assets/icons/notification/warning.svg?component';
import IconDanger from '~/assets/icons/notification/danger.svg?component';

const props = defineProps({
  label: { type: String, required: true },
  desc: { type: String, default: null },
  icon: { type: Object, default: null },
  type: { type: Array, default: () => [] },
  maxSize: { type: Number, default: null },

  isLoading: { type: Boolean, default: false },
  result: { type: Object, default: null }
})

const model = defineModel({ type: File, default: null })
const emit = defineEmits(['report', 'reset'])

const options = computed(() => {
  if (props.isLoading) {
    return {
      label: 'Uploading...',
      desc: 'Please wait a moment',
      icon: IconLoading,
      variant: 'primary'
    }
  }

  if (props.result) {
    let iconName = ''
    if (props.result.status === 'success') iconName = IconSuccess
    else if (props.result.status === 'warning') iconName = IconWarning
    else if (props.result.status === 'danger') iconName = IconDanger

    return {
      label: props.result.title || props.label,
      desc: props.result.message || props.desc,
      icon: iconName,
      variant: props.result.status,
    }
  }

  return {
    label: props.label,
    desc: props.desc,
    icon: props.icon,
    variant: null
  }
})

const displayClass = computed(() => {
  if (!props.result && !props.isLoading) return null

  return [props.result?.status, { 'no-event': props.result || props.isLoading }]
})
</script>

<template>
  <div class="attachment-feedback" :class="displayClass">
    <BaseInputAttachment
      v-bind="options"
      v-model="model"
      :type="type"
      :max-size="maxSize"
    />

    <div v-if="result" class="action-wrapper">
      <IconDocDownload class="icon-action" @click="emit('report')"/>
      <IconClose class="icon-action" @click="emit('reset')"/>
    </div>
  </div>
</template>

<style scoped>
.attachment-feedback {
  width: 100%;
  min-height: calc(var(--size-xl) * 7);

  display: flex;
  position: relative;
}

.attachment-feedback.no-event {
  pointer-events: none;
}

.attachment-feedback .action-wrapper {
  position: absolute;
  top: var(--size-xs);
  right: var(--size-xs);

  display: flex;
  align-items: center;
  gap: var(--size-xs);
}

.attachment-feedback .action-wrapper .icon-action {
  cursor: pointer;
}

.attachment-feedback .action-wrapper .icon-action:first-child {
  width: calc(var(--size-l) * 1.15);
  height: calc(var(--size-l) * 1.15);
}

.attachment-feedback .action-wrapper .icon-action:last-child {
  width: var(--size-l);
  height: var(--size-l);
}

.attachment-feedback.no-event .action-wrapper .icon-action {
  pointer-events: fill;
}

.attachment-feedback.primary .action-wrapper .icon-action {
  color: var(--primary-100);
}

.attachment-feedback.success .action-wrapper .icon-action {
  color: var(--success-100);
}

.attachment-feedback.warning .action-wrapper .icon-action {
  color: var(--warning-100);
}

.attachment-feedback.danger .action-wrapper .icon-action {
  color: var(--danger-100);
}
</style>
