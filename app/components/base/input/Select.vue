<script setup>
import IconArrow from '~/assets/icons/arrow/down.svg?component'

const props = defineProps({
  width: { type: String, default: '100%' },
  maxHeight: { type: String, default: '200px' },
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Pilih opsi...' },
  showLabel: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const model = defineModel({
  type: [String, Number],
  default: ''
})

const selected = computed(() => {
  const selected = props.options.find(item => item.value === model.value)
  return selected ? selected.label : null
})

const handleSelect = (option) => {
  model.value = option.value
  isOpen.value = false
}

const isOpen = ref(false)
const toggleDropdown = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const wrapperRef = ref(null)
onClickOutside(wrapperRef, () => (isOpen.value = false))
</script>

<template>
  <div ref="wrapperRef" class="select-wrapper">
    <label v-if="showLabel" :for="label">{{ label }}</label>
    <div class="container">
      <div class="select-box" :class="{ 'disabled': disabled }" @click="toggleDropdown">
        <span :class="{ 'placeholder': !selected }">{{ selected || placeholder }}</span>
        <IconArrow v-if="!disabled" class="icon-arrow" :class="{ 'is-open': isOpen }" />
      </div>

      <Transition name="slide-fade">
        <div v-if="isOpen" class="dropdown-wrapper">
          <ul class="options-list">
            <li v-for="item in options" :key="item.value" :class="{ 'active': model === item.value }" @click="handleSelect(item)">
              <span>{{ item.label }}</span>
            </li>
            <li v-if="options.length === 0" class="no-data">Data Not Found</li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.select-wrapper {
  width: v-bind(width);
  position: relative;

  display: flex;
  flex-direction: column;
  gap: var(--size-xxs);
}

.select-wrapper label {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--black);
}

.select-wrapper .container {
  width: 100%;
  position: relative;
}

.select-wrapper .container .select-box {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  padding: var(--size-xs);
  border-radius: var(--size-xs);

  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

.select-wrapper .container .select-box.disabled {
  cursor: default;
}

.select-wrapper .container .select-box span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--black);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.select-wrapper .container .select-box span.placeholder {
  color: var(--grey-300);
}

.select-wrapper .container .select-box .icon-arrow {
  width: var(--size-s);
  height: var(--size-s);
  stroke-width: 2px;

  color: var(--grey-200);
  transition: transform var(--transition-slow) var(--transition-bounce);
}

.select-wrapper .container .select-box .icon-arrow.is-open {
  transform: rotate(180deg);
}

.select-wrapper .container .select-box.disabled span {
  color: var(--grey-300);
}

.select-wrapper .container .dropdown-wrapper {
  position: absolute;
  left: 0; right: 0;
  top: 115%;
  z-index: 10;

  overflow: hidden;
  border-radius: var(--size-xs);

  background: var(--white);
  box-shadow: var(--shadow);
  border: 1px solid var(--grey-200);
}

.select-wrapper .container .dropdown-wrapper .options-list {
  max-height: v-bind(maxHeight);

  margin: 0;
  padding: 0;
  list-style: none;

  overflow-y: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  scrollbar-color: var(--grey-100) transparent;
}

.select-wrapper .container .dropdown-wrapper .options-list li {
  width: 100%;
  padding: var(--size-xs);
  cursor: pointer;

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
  transition: color var(--transition-normal) var(--transition-smooth),
              background-color var(--transition-normal) var(--transition-smooth);
}

.select-wrapper .container .dropdown-wrapper .options-list li:not(:last-child) {
  border-bottom: 1px solid var(--grey-200);
}

.select-wrapper .container .dropdown-wrapper .options-list li:hover,
.select-wrapper .container .dropdown-wrapper .options-list li.active {
  color: var(--black);
  background-color: var(--grey-50);
}

.select-wrapper .container .dropdown-wrapper .options-list .no-data {
  text-align: center;
  color: var(--grey-200);
}

.slide-fade-enter-active {
  transition: transform var(--transition-slow) var(--transition-anticipate),
              opacity var(--transition-slow) var(--transition-anticipate);
}

.slide-fade-leave-active {
  transition: transform var(--transition-slow) var(--transition-smooth),
              opacity var(--transition-slow) var(--transition-smooth);
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
