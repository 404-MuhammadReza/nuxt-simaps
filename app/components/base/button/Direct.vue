<script setup>
import GoogleMaps from '~/assets/icons/direct/google-maps.svg?component';
import Whatsapp from '~/assets/icons/direct/whatsaap.svg?component';

const props = defineProps({
  name: { type: String, required: true },
  value: { type: [String, Number, Object], required: true },
  state: {
    type: String,
    required: true,
    validator: value => ['google_maps', 'whatsaap'].includes(value)
  }
})

const meta = computed(() => {
  if (props.state === 'google_maps') return { label: 'Google Maps', icon: GoogleMaps }
  else if (props.state === 'whatsaap') return { label: 'WhatsApp', icon: Whatsapp }
  return { label: null, icon: null }
})

const { fetchLogs } = useAPI()
const directUrl = (value) => {
  if (props.state === 'google_maps' && value.lat && value.lng) {
    fetchLogs('Direct Link', `Google Maps: ${props.name}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${value.lat},${value.lng}`, '_blank')
  } else if (props.state === 'whatsaap' && value) {
    let cleanPhone = String(value).replace(/\D/g, '')
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1)
    fetchLogs('Direct Link', `WhatsApp: ${props.name}`)
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
  }
}
</script>

<template>
  <div v-if="meta.label && meta.icon" class="direct-button" :class="state" @click="directUrl(value)">
    <component :is="meta.icon" class="icon-direct" />
    <span>{{ meta.label }}</span>
  </div>
</template>

<style scoped>
.direct-button {
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: calc(var(--size-xxs) / 2);
}

.direct-button.google_maps {
  color: var(--primary-100);
}

.direct-button.whatsaap {
  color: var(--success-100);
}

.direct-button .icon-direct {
  width: var(--size-l);
  height: var(--size-l);
}

.direct-button span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);
}

.direct-button:hover span {
  text-decoration: underline;
}
</style>
