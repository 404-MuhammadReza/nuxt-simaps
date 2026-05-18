<script setup>
import IconCopy from '~/assets/icons/copy/default.svg?component';
import IconCopied from '~/assets/icons/copy/success.svg?component';

defineProps({
  width: { type: String, default: '100%' },
  variant: { type: String, default: null },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  icon: { type: Object, default: null },
  placeholder: { type: String, default: null },
  required: { type: Boolean, default: false },
  withCopy: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const reference = ref(null)
defineExpose({ input: reference })

const { copy, copied } = useClipboard()
const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <div class="input-wrapper" :class="variant">
    <div v-if="showLabel || $slots.default" class="label-wrapper">
      <label v-if="showLabel" :for="label" :class="{ required, disabled }">{{ label }}</label>
      <slot v-if="$slots.default"/>
    </div>
    <div class="inline">
      <Component
        :is="icon"
        v-if="icon"
        class="input-icon"
        :class="{ disabled }"
      />
      <input
        :id="label"
        ref="reference"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{
          'with-icon': !!icon,
          'with-copy': withCopy && disabled
        }"
        :required="required"
        autocomplete="off"
      >
      <Component
        :is="copied ? IconCopied : IconCopy"
        v-if="withCopy && disabled"
        class="copy-icon"
        :class="{ copied }"
        @click="copy(model)"
      />
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  width: v-bind(width);

  display: flex;
  flex-direction: column;
  gap: var(--size-xxs);
}

.input-wrapper .label-wrapper {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-xxs);
}

.input-wrapper .label-wrapper label {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--black);
}

.input-wrapper .label-wrapper label.required::after {
  content: '*';

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--danger-100);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.input-wrapper .label-wrapper label.required.disabled::after {
  color: var(--grey-200);
}

.input-wrapper .inline {
  width: 100%;
  position: relative;
}

.input-wrapper .inline .input-icon {
  width: var(--size-l);
  height: var(--size-l);

  position: absolute;
  left: var(--size-s); top: 50%;
  transform: translateY(-50%);

  color: var(--grey-300);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.input-wrapper .inline .copy-icon {
  width: var(--size-l);
  height: var(--size-l);

  position: absolute;
  right: var(--size-s); top: 50%;
  transform: translateY(-50%);

  cursor: pointer;
  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.input-wrapper .inline .copy-icon:hover {
  color: var(--grey-300);
}

.input-wrapper .inline .copy-icon.copied {
  color: var(--success-100);
}

.input-wrapper .inline input,
.input-wrapper .inline input::placeholder {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  transition: color var(--transition-normal) var(--transition-smooth);
}

.input-wrapper .inline input {
  width: 100%;

  padding: var(--size-xs);
  border-radius: var(--size-xs);

  outline: none;
  color: var(--black);
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

.input-wrapper.white .inline input {
  background-color: var(--white);
}

.input-wrapper .inline input:disabled,
.input-wrapper .inline input::placeholder,
.input-wrapper .inline .input-icon.disabled {
  color: var(--grey-300);
}

.input-wrapper .inline input.with-icon {
  padding-left: calc(var(--size-l) + var(--size-xl));
}

.input-wrapper .inline input.with-copy {
  padding-right: calc(var(--size-l) + var(--size-xl));
}
</style>
