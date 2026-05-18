<script setup>
defineProps({
  size: { type: String, default: 'calc(var(--size-m) * 2)' },
  variant: { type: String, default: null },
  label: { type: String, required: true },
  icon: { type: Object, required: true },
  showTooltip: { type: Boolean, default: false },
  position: {
    type: String,
    default: 'top',
    validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val)
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="button-wrapper" :class="variant">
    <button type="button" :aria-label="label" @click="emit('click')">
      <Component :is="icon" class="button-icon" />
    </button>
    <div v-if="showTooltip" class="tooltip" :class="position">
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.button-wrapper {
  position: relative;
}

.button-wrapper button {
  width: v-bind(size);
  height: v-bind(size);

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  cursor: pointer;
  padding: var(--size-xxs);
  border-radius: var(--size-xxs);

  color: var(--grey-300);
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);

  transition: transform var(--transition-normal) var(--transition-bounce),
              color var(--transition-normal) var(--transition-smooth),
              border-color var(--transition-normal) var(--transition-smooth),
              background-color var(--transition-normal) var(--transition-smooth);
}

.button-wrapper button:hover {
  transform: scale(1.1);
}

.button-wrapper.primary button:hover {
  color: var(--primary-100);
  border-color: var(--primary-100);
  background-color: var(--primary-50);
}

.button-wrapper.success button:hover {
  color: var(--success-100);
  border-color: var(--success-100);
  background-color: var(--success-50);
}

.button-wrapper.warning button:hover {
  color: var(--warning-100);
  border-color: var(--warning-100);
  background-color: var(--warning-50);
}

.button-wrapper.danger button:hover {
  color: var(--danger-100);
  border-color: var(--danger-100);
  background-color: var(--danger-50);
}

.button-wrapper button .button-icon {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
}

.button-wrapper .tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 10;

  padding: var(--size-xs);
  border-radius: var(--size-xxs);

  opacity: 0;
  color: var(--grey-300);
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);

  transition: opacity var(--transition-normal) var(--transition-smooth),
              transform var(--transition-normal) var(--transition-bounce);
}

.button-wrapper.primary .tooltip {
  color: var(--primary-100);
  background-color: var(--primary-50);
  border-color: var(--primary-100);
}

.button-wrapper.success .tooltip {
  color: var(--success-100);
  background-color: var(--success-50);
  border-color: var(--success-100);
}

.button-wrapper.warning .tooltip {
  color: var(--warning-100);
  background-color: var(--warning-50);
  border-color: var(--warning-100);
}

.button-wrapper.danger .tooltip {
  color: var(--danger-100);
  background-color: var(--danger-50);
  border-color: var(--danger-100);
}

.button-wrapper .tooltip.top {
  bottom: calc(100% + var(--size-xs)); left: 50%;
  transform: translateX(-50%) translateY(-4px);
}

.button-wrapper .tooltip.bottom {
  top: calc(100% + var(--size-xs)); left: 50%;
  transform: translateX(-50%) translateY(4px);
}

.button-wrapper .tooltip.right {
  left: calc(100% + var(--size-xs)); top: 50%;
  transform: translateY(-50%) translateX(4px);
}

.button-wrapper .tooltip.left {
  right: calc(100% + var(--size-xs)); top: 50%;
  transform: translateY(-50%) translateX(-4px);
}

.button-wrapper:hover .tooltip {
  opacity: 1;
}

.button-wrapper:hover .tooltip.top {
  transform: translateX(-50%) translateY(0);
}

.button-wrapper:hover .tooltip.bottom {
  transform: translateX(-50%) translateY(0);
}

.button-wrapper:hover .tooltip.right {
  transform: translateY(-50%) translateX(0);
}

.button-wrapper:hover .tooltip.left {
  transform: translateY(-50%) translateX(0);
}

.button-wrapper .tooltip::before {
  width: calc(var(--size-xs) - 2px);
  height: calc(var(--size-xs) - 2px);

  content: '';
  position: absolute;

  background-color: var(--grey-50);
}

.button-wrapper .tooltip.top::before {
  bottom: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: 1px solid var(--grey-200);
  border-right: 1px solid var(--grey-200);
}

.button-wrapper .tooltip.bottom::before {
  top: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: 1px solid var(--grey-200);
  border-left: 1px solid var(--grey-200);
}

.button-wrapper .tooltip.right::before {
  left: -5px; top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-bottom: 1px solid var(--grey-200);
  border-left: 1px solid var(--grey-200);
}

.button-wrapper .tooltip.left::before {
  right: -5px; top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-top: 1px solid var(--grey-200);
  border-right: 1px solid var(--grey-200);
}

.button-wrapper.primary .tooltip::before {
  border-color: var(--primary-100);
  background-color: var(--primary-50);
}

.button-wrapper.success .tooltip::before {
  border-color: var(--success-100);
  background-color: var(--success-50);
}

.button-wrapper.warning .tooltip::before {
  border-color: var(--warning-100);
  background-color: var(--warning-50);
}

.button-wrapper.danger .tooltip::before {
  border-color: var(--danger-100);
  background-color: var(--danger-50);
}

.button-wrapper .tooltip span {
  display: block;

  font-family: var(--font-primary);
  font-size: var(--size-s);
  font-weight: var(--font-medium);
  white-space: nowrap;
  line-height: 1;
}
</style>
