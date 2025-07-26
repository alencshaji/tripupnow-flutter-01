<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 border-b border-border dark:border-gray-700 text-foreground dark:text-gray-100 px-4 py-2 flex items-center justify-between shadow-sm"
  >
    <img src="@/assets/TripUpNow2.png" alt="Logo" class="h-10" />

    <div class="flex items-center gap-4">
      <Button size="icon" variant="outline" @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Icon :icon="isDarkMode ? 'radix-icons:sun' : 'radix-icons:moon'" class="h-6 w-6" />
      </Button>
      <span
        class="material-icons text-muted-foreground dark:text-gray-400 cursor-pointer hover:text-primary transition-colors"
        @click="goToNotifications"
      >
        notifications
      </span>

      <img
        :src="avatarImg"
        alt="Avatar"
        class="h-9 w-9 rounded-full object-cover cursor-pointer"
        @click="goToProfile"
      />

    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import avatarImg from '@/assets/avatar.png';
import { useColorMode } from '@vueuse/core';
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import Button from '@/components/ui/button/Button.vue';

const router = useRouter();
const mode = useColorMode();
const isDarkMode = ref(mode.value === 'dark');

watch(isDarkMode, (newValue) => {
  mode.value = newValue ? 'dark' : 'light';
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

const goToNotifications = () => {
  router.push({ name: 'NotificationsPage' });
};
const goToProfile = () => {
  router.push({ name: 'ProfilePage' });
};
</script>