<script setup>
import IconClose from '~/assets/icons/state/close.svg?component';

defineProps({
  title: { type: String, default: null },
  maxWidth: { type: String, default: '1000px' }
})

const reference = ref(null)
const emit = defineEmits(['close'])
onClickOutside(reference, () => emit('close'))
</script>

<template>
  <div ref="reference" class="modal-container">
    <header>
      <div class="left">
        <span v-if="title" class="title">{{ title }}</span>
        <slot v-if="$slots.header" name="header"/>
      </div>
      <div class="right">
        <IconClose class="icon-close" @click="emit('close')"/>
      </div>
    </header>

    <div v-if="$slots.toolbox" class="toolbox">
      <slot name="toolbox"/>
    </div>

    <div v-if="$slots.content" class="content">
      <slot name="content"/>
    </div>

    <footer v-if="$slots.footer">
      <slot name="footer"/>
    </footer>
  </div>
</template>

<style scoped>
.modal-container {
  width: 90%;
  max-height: 90vh;
  max-width: v-bind(maxWidth);

  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(1);
  z-index: 999;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  border-radius: var(--size-m);
  background-color: var(--white);
  box-shadow: var(--shadow);
}

.modal-container header {
  width: 100%;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--size-m);
  border-bottom: 1px solid var(--grey-200);
}

.modal-container header .left,
.modal-container header .right {
  display: flex;
  align-items: center;
  gap: var(--size-xl);

  overflow: hidden;
}

.modal-container header .left span.title {
  font-family: var(--font-primary);
  font-size: var(--size-l);
  font-weight: var(--font-medium);

  text-overflow: ellipsis;
  white-space: nowrap;

  display: block;
  overflow: hidden;

  color: var(--black);
}

.modal-container header .right .icon-close {
  width: var(--size-l);
  height: var(--size-l);

  cursor: pointer;
  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.modal-container header .right .icon-close:hover {
  color: var(--danger-100);
}

.modal-container .toolbox {
  width: 100%;
  flex-shrink: 0;

  padding: var(--size-m);
  background-color: var(--grey-50);
  border-bottom: 1px solid var(--grey-200);
}

.modal-container .content {
  flex: 1;

  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--grey-200) transparent;
}

.modal-container footer {
  width: 100%;
  flex-shrink: 0;

  padding: var(--size-m);
  border-top: 1px solid var(--grey-200);
}
</style>
