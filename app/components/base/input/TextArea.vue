<script setup>
import IconCopy from '~/assets/icons/copy/default.svg?component';
import IconCopied from '~/assets/icons/copy/success.svg?component';

const props = defineProps({
  width: { type: String, default: '100%' },
  maxHeight: { type: String, default: 'none' },
  autoResize: { type: Boolean, default: false },
  label: { type: String, required: true },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  withCopy: { type: Boolean, default: false },
  showLabel: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const { copy, copied } = useClipboard()
const model = defineModel({ type: String, default: '' })
const textarea = ref(null)

const resize = async () => {
  if (!props.autoResize) return

  await nextTick()
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

watch(model, () => { resize() }, { immediate: true })
</script>

<template>
  <div class="textarea-wrapper">
    <div v-if="showLabel || $slots.default" class="label-wrapper">
      <label v-if="showLabel" :for="label" :class="{ required, disabled }">{{ label }}</label>
      <slot v-if="$slots.default"/>
    </div>
    <textarea
      :id="label"
      ref="textarea"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <Component
      :is="copied ? IconCopied : IconCopy"
      v-if="withCopy && disabled"
      class="copy-icon"
      :class="{ copied }"
      @click="copy(model)"
    />
  </div>
</template>

<style scoped>
.textarea-wrapper {
  width: v-bind(width);
  position: relative;

  display: flex;
  flex-direction: column;
  gap: var(--size-xxs);

}

.textarea-wrapper .label-wrapper {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-xxs);
}

.textarea-wrapper .label-wrapper label {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--black);
}

.textarea-wrapper .label-wrapper label.required::after {
  content: '*';

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--danger-100);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.textarea-wrapper .label-wrapper label.required.disabled::after {
  color: var(--grey-200);
}

.textarea-wrapper textarea,
.textarea-wrapper textarea::placeholder {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);
  text-align: justify;
  line-height: 1.5;

  transition: color var(--transition-normal) var(--transition-smooth);
}

.textarea-wrapper textarea {
  width: 100%;
  max-height: v-bind(maxHeight);

  padding: var(--size-xs);
  border-radius: var(--size-xs);

  resize: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  scrollbar-color: var(--grey-200) transparent;

  outline: none;
  color: var(--black);
  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

.textarea-wrapper textarea:disabled,
.textarea-wrapper textarea::placeholder {
  color: var(--grey-300);
}

.textarea-wrapper .copy-icon {
  width: var(--size-l);
  height: var(--size-l);

  position: absolute;
  right: var(--size-s); bottom: var(--size-s);

  cursor: pointer;
  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.textarea-wrapper .copy-icon:hover {
  color: var(--grey-300);
}

.textarea-wrapper .copy-icon.copied {
  color: var(--success-100);
}
</style>
