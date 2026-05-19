<script setup>
defineProps({
  label: { type: String, required: true },
  showLabel: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const today = new Date().toISOString().split('T')[0]
const start = defineModel('start', { type: String, default: '' })
const end = defineModel('end', { type: String, default: '' })
</script>

<template>
  <div class="date-wrapper">
    <label  v-if="showLabel" :for="label">{{ label }}</label>
    <div v-else class="inline">
      <input
        v-model="start"
        type="date"
        :max="end || today"
        :class="{ 'has-value': start }"
        :disabled="disabled"
      >
      <span>s/d</span>
      <input
        v-model="end"
        type="date"
        :min="start"
        :max="today"
        :class="{ 'has-value': end }"
        :disabled="disabled"
      >
    </div>
  </div>
</template>

<style scoped>
.date-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--size-xs);
}

.date-wrapper label {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--black);
}

.date-wrapper .inline {
  width: 100%;

  display: flex;
  align-items: center;
  gap: var(--size-s);
}

.date-wrapper .inline input {
  padding: calc(var(--size-xs) - 1.25px) var(--size-xs);
  border-radius: var(--size-xs);

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  outline: none;
  color: var(--black);
  background-color: var(--white);
  border: 1px solid var(--grey-200);

  transition: color var(--transition-normal) var(--transition-smooth),
              background-color var(--transition-normal) var(--transition-smooth);
}

.date-wrapper .inline input:not(.has-value) {
  color: var(--grey-300);
}

.date-wrapper .inline input:disabled {
  cursor: default;

  color: var(--grey-200);
  background-color: var(--grey-50);
}

.date-wrapper .inline input::-webkit-calendar-picker-indicator {
  width: var(--size-l);
  height: var(--size-l);

  cursor: pointer;
  opacity: 0.5;
}

.date-wrapper .inline input::-webkit-inner-spin-button,
.date-wrapper .inline input::-webkit-clear-button {
  display: none;
}

.date-wrapper .inline span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);
  white-space: nowrap;

  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.date-wrapper .inline:has(input:disabled) span {
  color: var(--grey-100);
}
</style>
