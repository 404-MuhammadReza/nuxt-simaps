<script setup>
import IconNotification from '~/assets/icons/notification/default.svg?component';
import IconSuccess from '~/assets/icons/notification/success.svg?component';
import IconWarning from '~/assets/icons/notification/warning.svg?component';
import IconDanger from '~/assets/icons/notification/danger.svg?component';

const app = useAppStore()
const { notification } = storeToRefs(app)

const displayIcon = (type) => {
  switch (type) {
    case 'primary': return IconNotification
    case 'success': return IconSuccess
    case 'warning': return IconWarning
    case 'danger': return IconDanger
  }

  return IconNotification
}
</script>

<template>
  <div class="notification-wrapper">
    <TransitionGroup name="notification-list">
      <div v-for="item in notification" :key="item.id" class="item" :class="item.type">
        <component :is="displayIcon(item.type)" class="icon-notification" />
        <span>{{ item.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-wrapper {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--size-xs);

  position: fixed;
  bottom: var(--size-xl);
  right: var(--size-xl);
  z-index: 9999;

  pointer-events: none;
}

.notification-wrapper .item {
  min-width: calc(var(--size-xl) * 10);

  display: flex;
  align-items: center;
  gap: var(--size-xs);

  padding: var(--size-s);
  border-radius: var(--size-xs);
  pointer-events: auto;

  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.notification-wrapper .item.primary {
  color: var(--primary-100);
  background-color: var(--primary-50);
  border-left: 2.5px solid var(--primary-100);
}

.notification-wrapper .item.success {
  color: var(--success-100);
  background-color: var(--success-50);
  border-left: 2.5px solid var(--success-100);
}

.notification-wrapper .item.warning {
  color: var(--warning-100);
  background-color: var(--warning-50);
  border-left: 2.5px solid var(--warning-100);
}

.notification-wrapper .item.danger {
  color: var(--danger-100);
  background-color: var(--danger-50);
  border-left: 2.5px solid var(--danger-100);
}

.notification-wrapper .item .icon-notification {
  width: var(--size-xl);
  height: var(--size-xl);
}

.notification-wrapper .item span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  white-space: nowrap;
}

.notification-list-enter-active,
.notification-list-leave-active, .notification-list-move {
  transition: all var(--transition-normal) var(--transition-pop);
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.8);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.notification-list-leave-active {
  position: absolute;
  width: fit-content;
}
</style>
