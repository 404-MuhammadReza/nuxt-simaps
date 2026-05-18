<script setup>
import IconCall from '~/assets/icons/general/call.svg?component';

const data = ref([
  { name: 'Dr. Yanuar Soenartono', phone: '081315583700'},
  { name: 'Rihar Ardiansyah', phone: '082158639271'},
  { name: 'Riany Sinasari', phone: '081214783451'},
  { name: 'Devi Kusmirat', phone: '081388732267'},
  { name: 'Fita Rosiana', phone: '082210470052'}
])

const emit = defineEmits(['close'])
</script>

<template>
  <BaseModal title="Emergency Contact" max-width="450px" @close="emit('close')">
    <template #content>
      <div class="emergency-content">
        <BaseInputDefault v-for="(item, index) in data" :key="index" v-model="item.phone" :label="item.name" :icon="IconCall" show-label disabled>
          <BaseButtonDirect state="whatsaap" :name="`Emergency - ${item.name}`" :value="item.phone" />
        </BaseInputDefault>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.emergency-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: var(--size-m);
  gap: var(--size-m);
}
</style>
