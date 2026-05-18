<script setup>
const props = defineProps({
  width: { type: String, default: '100%' },
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  unit: { type: String, default: null },
  showLabel: { type: Boolean, default: false },
  showRange: { type: Boolean, default: false }
})

const model = defineModel({
  type: Number,
  default: (rawProps) => Math.floor((rawProps.min + rawProps.max) / 2)
})

const background = computed(() => {
  const percentage = ((model.value - props.min) / (props.max - props.min)) * 100
  return `linear-gradient(to right, var(--primary-100) ${percentage}%, var(--grey-100) ${percentage}%)`
})
</script>

<template>
  <div class="slider-wrapper">
    <div v-if="showLabel" class="label-wrapper">
      <label :for="label">{{ label }}</label>
      <span>{{ model }} {{ unit }}</span>
    </div>

    <input
      :id="label"
      v-model.number="model"
      type="range"
      :min="min"
      :max="max"
      :style="{ background: background }"
    >

    <div v-if="showRange" class="range-wrapper">
      <span>{{ min }} {{ unit }}</span>
      <span>{{ max }} {{ unit }}</span>
    </div>
  </div>
</template>

<style scoped>
.slider-wrapper {
  width: v-bind(width);

  display: flex;
  flex-direction: column;
  gap: var(--size-xs);
}

.slider-wrapper .label-wrapper,
.slider-wrapper .range-wrapper {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-wrapper .label-wrapper label,
.slider-wrapper .label-wrapper span,
.slider-wrapper .range-wrapper span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
}

.slider-wrapper .label-wrapper label {
  font-weight: var(--font-semi-bold);
  color: var(--black);
}

.slider-wrapper .label-wrapper span {
  font-weight: var(--font-semi-bold);
  color: var(--primary-100);
}

.slider-wrapper .range-wrapper span {
  font-weight: var(--font-regular);
  color: var(--grey-300);
}

.slider-wrapper input {
  width: 100%;
  height: calc(var(--size-xxs) + 3px);
  border-radius: 100px;

  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.slider-wrapper input::-webkit-slider-thumb {
  width: calc(var(--size-xl) - 2px);
  height: calc(var(--size-xl) - 2px);

  cursor: grab;
  border-radius: 50%;

  appearance: none;
  -webkit-appearance: none;

  border: 2.5px solid var(--white);
  background-color: var(--primary-100);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);

  transition: transform var(--transition-normal) var(--transition-bounce);
}

.slider-wrapper input::-webkit-slider-thumb:hover {
  transform: scale(1.05);
}

.slider-wrapper input::-webkit-slider-thumb:active {
  transform: scale(1.1);
  cursor: grabbing;
}
</style>
