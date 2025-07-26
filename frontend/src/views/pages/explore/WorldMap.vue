<script setup lang="ts">
defineProps<{ 
  dots: { start: { lat: number; lng: number }; end: { lat: number; lng: number } }[] 
}>();
</script>

<template>
  <div class="world-map-container">
    <h3>World Map Placeholder</h3>
    <ul>
      <li v-for="(dot, index) in dots" :key="index">
        Start: {{ dot.start.lat }}, {{ dot.start.lng }} → 
        End: {{ dot.end.lat }}, {{ dot.end.lng }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.world-map-container {
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
}
</style>
