<template>
<div>
  <HomeHero />
  <HomeCategories />
  <HomeRecommendedSection />
  <HomePackagesSection />
</div>
</template>

<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue';
import HomeCategories from '@/components/home/HomeCategories.vue';
import HomeRecommendedSection from './HomeRecommendedSection.vue';
import HomePackagesSection from './HomePackagesSection.vue';
</script>
<style  scoped>
</style>