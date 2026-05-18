<script setup>
import LogoIcon from '~/assets/logo/loading/timah-icon.svg?component';
import LogoText from '~/assets/logo/loading/timah-text.svg?component';

const app = useAppStore();
const { googleMapState } = storeToRefs(app);

const emit = defineEmits(['finished']);

const stopState = ref(false);
watch(googleMapState, (newVal) => {
  if (newVal) stopState.value = true;
});

const isLoading = ref(true);
const isSpinning = ref(true);
const isShowText = ref(false);
const handleStop = () => {
  if (stopState.value && isSpinning.value) {
    isSpinning.value = false;

    setTimeout(() => { isShowText.value = true;
      setTimeout(() => { isLoading.value = false;
        setTimeout(() => emit('finished'), 800);
      }, 2500);
    }, 100);
  }
};
</script>

<template>
  <Transition name="fade-loading">
    <div v-if="isLoading" class="loading-overlay">
      <div class="logo-wrapper" :class="{ 'final': isShowText }">
        <LogoIcon class="icon" :class="{ 'spinning': isSpinning }" @animationiteration="handleStop" />
        <div class="text-mask">
          <div class="text-layouting">
            <LogoText class="text" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  z-index: 99999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--white);
}

.loading-overlay .logo-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-s);

  transition: all 1s cubic-bezier(0.76, 0, 0.24, 1);
}

.loading-overlay .logo-wrapper .icon {
  width: calc(var(--size-xl) * 4);
  height: calc(var(--size-xl) * 4);

  transition: transform 0.5s ease-out;
}

.loading-overlay .logo-wrapper .icon.spinning {
  animation: spinning 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.loading-overlay .logo-wrapper .text-mask {
  width: 0; opacity: 0;
  overflow: hidden;
  transform: translateY(var(--size-xl));
  transition: width 1.2s cubic-bezier(0.83, 0, 0.17, 1),
              opacity 0.8s ease-in;
}

.loading-overlay .logo-wrapper .text-mask .text-layouting {
  height: calc(var(--size-xl) * 2.5);

  transform: translateX(100%);
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.loading-overlay .logo-wrapper .text-mask .text-layouting .text {
  width: auto;
  height: 100%;
}

.loading-overlay .logo-wrapper.final .text-mask {
  width: calc(var(--size-xl) * 9.5);
  opacity: 1;
}

.loading-overlay .logo-wrapper.final .text-mask .text-layouting {
  transform: translateX(0);
}

.fade-loading-leave-active { transition: opacity 0.8s ease-in-out; }
.fade-loading-leave-to { opacity: 0; }

@keyframes spinning {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
