<script setup>
import IconEmployee from '~/assets/icons/entity/employee.svg?component';

const props = defineProps({
  employees: { type: Array, default: () => [] },
})

const model = defineModel({ type: String, default: '' })
const emit = defineEmits(['click'])

const result = computed(() => {
  if (!props.employees || model.value === '@') return []
  const keyword = model.value.slice(1).toLowerCase()
  return props.employees.filter(emp => emp.name.toLowerCase().includes(keyword)).slice(0, 5)
})

const reference = ref(null)
const focus = () => {
  if (reference.value?.input) reference.value.input.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="search-wrapper">
    <BaseInputDefault
      ref="reference"
      v-model="model"
      label="User Profile"
      :icon="IconEmployee"
    />
    <ul v-if="model.length > 1" class="search-result">
      <li v-for="employee in result" :key="employee.id" class="employee" @click="emit('click', employee)">
        <FeaturesEmployeePicture
          :src="employee.picture_url"
          :alt="employee.name"
          size="calc(var(--size-xxl) * 1.5)"
          border="var(--size-xxs)"
          disabled
        />
        <div class="information">
          <span>{{ employee.name }}</span>
          <span>{{ employee.position }}</span>
        </div>
      </li>
      <li v-if="employees.length === 0" class="empty">
        <span>Employee not found</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-wrapper {
  width: 100%;
  position: relative;
}

.search-wrapper ul.search-result {
  width: 100%;

  position: absolute;
  top: 100%; left: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;

  margin-top: var(--size-xxs);
  border-radius: var(--size-xs);
  overflow: hidden;

  background-color: var(--white);
  border: 1px solid var(--grey-200);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.search-wrapper ul.search-result li.employee {
  width: 100%;

  display: flex;
  align-items: center;
  gap: var(--size-xs);

  cursor: pointer;
  padding: calc(var(--size-xs) / 1.5);
}

.search-wrapper ul.search-result li.employee:not(:first-child) {
  border-top: 1px solid var(--grey-200);
}

.search-wrapper ul.search-result li.employee:hover {
  background-color: var(--grey-50);
}

.search-wrapper ul.search-result li.employee .information {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: calc(var(--size-xxs) / 2);

  overflow: hidden;
}

.search-wrapper ul.search-result li.employee .information span {
  font-family: var(--font-primary);

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.search-wrapper ul.search-result li.employee .information span:first-child {
  font-size: var(--size-m);
  font-weight: var(--font-medium);

  color: var(--black);
}

.search-wrapper ul.search-result li.employee .information span:last-child {
  font-size: var(--size-s);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}

.search-wrapper ul.search-result li.empty {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--size-s);
}

.search-wrapper ul.search-result li.empty span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}
</style>
