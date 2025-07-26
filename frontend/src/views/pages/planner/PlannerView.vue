<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Trip Planner</h2>

    <Button @click="onGeneratePlans">
      Generate Plans
    </Button>

    <div v-if="plans.length" class="mt-6">
      <h3 class="text-lg font-bold mb-2">Generated Plans</h3>
      <ul class="list-disc ml-6 space-y-2">
        <li v-for="(plan, index) in plans" :key="index">
        
          
        </li>
      </ul>
    </div>

    <div v-else class="mt-6 text-muted-foreground">No plans generated yet.</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { usePlaceStore } from '@/stores/placeStore';

const placeStore = usePlaceStore();

const plans = computed(() => placeStore.getPlans);

// Type-safe check for generatePlans method
function onGeneratePlans(): void {
  placeStore.generatePlans(); // This must exist in your store
}
</script>

