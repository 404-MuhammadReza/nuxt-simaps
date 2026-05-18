<script setup>
defineProps({
  width: { type: String, default: 'auto' },
  variant: { type: String, default: null },
  label: { type: String, required: true },
  icon: { type: Object, default: null },
  type: { type: String, default: 'button' },
  always: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button :type="type" :class="[variant, { always }]" @click="emit('click')">
    <Component :is="icon" v-if="icon" class="icon-button"/>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
button {
  width: v-bind(width);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-xxs);

  cursor: pointer;
  padding: var(--size-xs);
  border-radius: var(--size-xs);

  color: var(--grey-300);
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);

  transition: color var(--transition-normal) var(--transition-smooth),
              border-color var(--transition-normal) var(--transition-smooth),
              background-color var(--transition-normal) var(--transition-smooth);
}

button:is(.primary, .success, .warning, .danger) {
  color: var(--black);
  background-color: var(--white);
  border: 1px solid var(--grey-200);
}

button.primary.always,
button.primary:hover {
  color: var(--primary-100);
  border-color: var(--primary-100);
  background-color: var(--primary-50);
}

button.success.always,
button.success:hover {
  color: var(--success-100);
  border-color: var(--success-100);
  background-color: var(--success-50);
}

button.warning.always,
button.warning:hover {
  color: var(--warning-100);
  border-color: var(--warning-100);
  background-color: var(--warning-50);
}

button.danger.always,
button.danger:hover {
  color: var(--danger-100);
  border-color: var(--danger-100);
  background-color: var(--danger-50);
}

button .icon-button {
  width: var(--size-l);
  height: var(--size-l);

  flex-shrink: 0;
}

button span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  text-transform: capitalize;
  white-space: nowrap;
}
</style>
