<script setup>
import IconNotification from '~/assets/icons/notification/default.svg?component'

const props = defineProps({
  variant: { type: String, default: null },
  label: { type: String, required: true },
  icon: { type: Object, default: null },
  confirmTimer: { type: Number, default: 3 },
  confirmLabel: { type: String, default: 'Are you sure?' }
})

let timer = null
const isConfirming = ref(false)
const countdown = ref(props.confirmTimer)

const reset = () => {
  if (timer) clearInterval(timer)
  isConfirming.value = false
  countdown.value = props.confirmTimer
}

const emit = defineEmits(['click'])
const handleClick = () => {
  if (!isConfirming.value) {
    isConfirming.value = true
    countdown.value = props.confirmTimer

    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) reset()
    }, 1000)
  } else {
    emit('click')
    reset()
  }
}

const activeVariant = computed(() => {
  if (isConfirming.value) return 'danger'
  else return props.variant
})

const displayLabel = computed(() => {
  if (isConfirming.value) return `${props.confirmLabel} (${countdown.value})`
  else return props.label
})

const displayIcon = computed(() => {
  if (isConfirming.value) return IconNotification
  else return props.icon
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <BaseButtonDefault
    :variant="activeVariant"
    :label="displayLabel"
    :icon="displayIcon"
    :always="isConfirming"
    @click="handleClick"
  />
</template>
