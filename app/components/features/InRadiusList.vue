<script setup>
defineProps({
  data : { type: Array, default: () => [] }
})

const app = useAppStore()
const { setFocus, clearFocus } = app

const emit = defineEmits(['click'])
</script>

<template>
  <ul class="container" @mouseleave="clearFocus()">
    <li v-for="item in data" :key="item.id" class="item" @mouseenter="setFocus(item.id)" @click="emit('click', item)">
      <FeaturesEmployeePicture
        v-if="item.employee_id"
        :src="item.picture_url"
        :alt="item.name"
        size="calc(var(--size-xl) * 2)"
        border="var(--size-xxs)"
      />
      <div class="information">
        <span>{{ item.name }}</span>
        <template v-if="item.employee_id">
          <span>{{ item.position }}</span>
        </template>
      </div>
    </li>
  </ul>
</template>

<style scoped>
ul.container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: calc(var(--size-xs) - 2px);

  overflow-y: auto;
  scrollbar-width: none;

  padding: calc(var(--size-xs) - 2px);
  border-radius: var(--size-s);

  background-color: var(--grey-50);
  border: 1px solid var(--grey-200);
}

ul.container li.item {
  width: 100%;

  display: flex;
  align-items: center;
  gap: var(--size-xs);

  cursor: pointer;
  padding: calc(var(--size-xs) - 2px);
  border-radius: var(--size-xs);

  background-color: var(--white);
  border: 1px solid var(--grey-200);

  will-change: transform;
  transition: transform var(--transition-normal) var(--transition-snappy),
              box-shadow var(--transition-normal) var(--transition-smooth);
}

ul.container li.item:hover {
  transform: scale(1.02);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

ul.container li.item .information {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: calc(var(--size-xxs) / 2);

  overflow: hidden;
}

ul.container li.item .information span {
  font-family: var(--font-primary);

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

ul.container li.item .information span:nth-child(1) {
  font-size: var(--size-m);
  font-weight: var(--font-medium);
  color: var(--black);
}

ul.container li.item .information span:nth-child(2) {
  font-size: calc(var(--size-m) - 2px);
  font-weight: var(--font-regular);
  color: var(--grey-300);
}
</style>
