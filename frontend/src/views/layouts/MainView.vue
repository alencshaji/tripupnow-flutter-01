<template>
  <div>
    <HeaderBar v-if="route.name !== 'ProfilePage'" />
    <div class="main-content" :class="contentClass">
      <router-view />
    </div>
    <FooterBar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import FooterBar from './Footer.vue'
import HeaderBar from './Header.vue'

const contentClass = computed(() => ({
  'no-padding': route.name === 'ProfilePage',
  'with-padding': route.name !== 'ProfilePage'
}));
const route = useRoute()
</script>

<style scoped>
.no-padding {
  padding-top: 0px;
}
.with-padding{
  padding-top: 60px;
}
</style>
