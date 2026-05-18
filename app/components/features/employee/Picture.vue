<script setup>
import IconUser from '~/assets/img/user-thumbnail.svg?img';
import IconDelete from '~/assets/icons/general/delete.svg?component';

const props = defineProps({
  size: { type: String, default: 'calc(var(--size-xl) * 2)' },
  border: { type: String, default: 'var(--size-xxs)' },
  src: { type: String, default: null },
  alt: { type: String, default: 'User Picture' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
const handleClick = () => {
  if (!props.disabled && props.src) emit('click')
}
</script>

<template>
  <div class="picture-wrapper" :class="{ 'disabled': disabled || !src }" @click="handleClick">
    <img :src="src || IconUser" :alt="alt" loading="lazy">
    <div v-if="!disabled && src" class="delete-overlay">
      <IconDelete class="icon-delete" />
    </div>
  </div>
</template>

<style scoped>
.picture-wrapper {
  width: v-bind(size);
  height: v-bind(size);
  flex-shrink: 0;

  position: relative;
  overflow: hidden;

  border-radius: v-bind(border);
  border: 1px solid var(--grey-200);

  transition: border-color var(--transition-normal) var(--transition-smooth);
}

.picture-wrapper:not(.disabled) {
  cursor: pointer;
}

.picture-wrapper:not(.disabled):hover {
  border-color: var(--danger-100);
}

.picture-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picture-wrapper .delete-overlay {
  position: absolute;
  top: 0; left: 0;
  right: 0; bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  background-color: var(--danger-50);

  transition: opacity var(--transition-fast) var(--transition-smooth);
}

.picture-wrapper:not(.disabled):hover .delete-overlay {
  opacity: 1;
}

.picture-wrapper .delete-overlay .icon-delete {
  width: calc(v-bind(size) / 2.5);
  height: calc(v-bind(size) / 2.5);

  transform: scale(0.8);
  color: var(--danger-100);

  transition: transform var(--transition-normal) var(--transition-bounce);
}

.picture-wrapper:not(.disabled):hover .delete-overlay .icon-delete {
  transform: scale(1);
}
</style>
