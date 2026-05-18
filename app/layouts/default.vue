<script setup>
import IconSidebar from '~/assets/icons/sidebar/toggle-open.svg?component';
// import IconEmergency from '~/assets/icons/state/emergency.svg?component';

const data = useDataStore()
const { selected, nearestHospital } = storeToRefs(data)

const { initMe, initEmployees, initHospitals, clearSelected } = data
await Promise.all([
  useAsyncData('me', () => initMe()),
  useAsyncData('employees', () => initEmployees()),
  useAsyncData('hospitals', () => initHospitals()),
])

const sidebarState = ref(false);
const toggleSidebar = () => {
  sidebarState.value = !sidebarState.value;
};

const settingState = ref(false);
const toggleSetting = () => {
  settingState.value = !settingState.value;
};

const emergencyState = ref(false);
const toggleEmergency = () => {
  emergencyState.value = !emergencyState.value;
};

const { isMobile, isTablet } = useDevice()
watch(isMobile, (mobile) => {
  if (mobile) sidebarState.value = false
  else sidebarState.value = true
}, { immediate: true })

watch([selected, emergencyState], ([newSelection, newEmergency]) => {
  if (isMobile.value || isTablet.value) {
    sidebarState.value = !newSelection && !newEmergency
  }
})
</script>

<template>
  <div class="app-layouts">
    <BaseLoadingDefault />
    <FeaturesNotification />

    <transition name="slide">
      <aside v-if="sidebarState && !settingState">
        <LayoutTheSidebar
          @toggle-sidebar="toggleSidebar"
          @toggle-setting="toggleSetting"
          @toggle-emergency="toggleEmergency"
        />
      </aside>
    </transition>

    <transition name="button-fade">
      <div v-if="!sidebarState" class="sidebar-button">
        <BaseButtonIcon
          size="calc(var(--size-l) * 2)"
          variant="primary"
          label="Show Sidebar"
          position="right"
          :icon="IconSidebar"
          show-tooltip
          @click="toggleSidebar"
        />
      </div>
    </transition>

    <!-- <div class="emergency-button">
      <BaseButtonIcon
        size="calc(var(--size-l) * 2)"
        variant="danger"
        label="Emergency Contact"
        position="left"
        :icon="IconEmergency"
        show-tooltip
        @click="toggleEmergency"
      />
    </div> -->

    <Transition name="modal-fade">
      <FeaturesModalInformation
        v-if="selected"
        v-model="selected"
        v-model:nearest="nearestHospital"
        @close="clearSelected"
      />
    </Transition>

    <Transition name="modal-fade">
      <FeaturesModalSetting
        v-if="settingState"
        @close="toggleSetting"
      />
    </Transition>

    <Transition name="modal-fade">
      <FeaturesModalEmergency
        v-if="emergencyState"
        @close="toggleEmergency"
      />
    </Transition>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layouts {
  position: relative;
}

.app-layouts aside {
  width: 80%;
  height: 100%;
  max-width: 350px;

  position: absolute;
  top: 0; left: 0;
  z-index: 1;

  padding: var(--size-m);
}

.app-layouts .sidebar-button {
  position: absolute;
  top: var(--size-l);
  left: var(--size-l);
  z-index: 1;
}

/* .app-layouts .emergency-button {
  position: absolute;
  top: var(--size-l);
  right: var(--size-l);
  z-index: 1;
} */

/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: transform var(--transition-slow) var(--transition-anticipate);
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}

.button-fade-enter-active, .button-fade-leave-active {
  transition: opacity var(--transition-slow) var(--transition-anticipate),
              transform var(--transition-slow) var(--transition-anticipate);
}

.button-fade-enter-from, .button-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(-10px);
}

.button-fade-enter-active, .slide-enter-active {
  transition-delay: 0.3s;
}

.modal-fade-enter-active {
  transition: opacity var(--transition-normal) var(--transition-smooth),
              transform var(--transition-normal) var(--transition-bounce);
}

.modal-fade-leave-active {
  transition: opacity var(--transition-normal) var(--transition-smooth),
              transform var(--transition-normal) var(--transition-smooth);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);;
}
</style>
