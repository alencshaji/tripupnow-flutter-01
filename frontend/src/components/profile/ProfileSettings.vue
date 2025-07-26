<template>
  <div class="p-6 rounded-lg shadow-2xl bg-card">
    <h3 class="text-lg font-semibold text-primary mb-4">Settings</h3>

    <div v-for="(item, index) in items" :key="index">
      <div class="flex items-center justify-between py-3">
        <span class="text-sm text-primary">{{ item.label }}</span>
        <i class="pi pi-angle-right text-gray-400"></i>
      </div>
      <Separator v-if="index < items.length - 1" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Separator } from '@/components/ui/separator';

const items = ref([
  {
    label: 'Account details',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'Password and security',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'Report a problem',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'Invite a friend',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'App updates',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'Help',
    icon: 'pi pi-angle-right',
  },
  {
    label: 'About',
    icon: 'pi pi-angle-right',
  },
]);
</script>