<template>
  <div class="flex p-2 flex-row relative">
    <img
      @click="toExplorePage()"
      src="https://cdn.jsdelivr.net/gh/arunchamakkalayil/places/banner3.png
"
      width="100%"
      alt=""
    />
    <span class="top-10 left-28 absolute text-lg font-semibold"
      >Browse By Search</span
    >
  </div>
  <h3 class="pl-4 pt-2 text-lg font-semibold">Recommended</h3>

  <!-- Loading State -->
  <div
    v-if="loading"
    class="p-4 overflow-x-auto whitespace-nowrap hide-scrollbar"
  >
    <div class="flex flex-row gap-4">
      <div class="w-[150px] p-2 rounded-lg shadow">
        <Skeleton class="mb-1 h-[5rem] w-full" />
        <Skeleton class="mb-1 w-full" />
        <Skeleton class="w-[75%]" />
      </div>
      <div class="w-[150px] p-2 rounded-lg shadow">
        <Skeleton class="mb-1 h-[5rem] w-full" />
        <Skeleton class="mb-1 w-full" />
        <Skeleton class="w-[75%]" />
      </div>
      <div class="w-[150px] p-2 rounded-lg shadow">
        <Skeleton class="mb-1 h-[5rem] w-full" />
        <Skeleton class="mb-1 w-full" />
        <Skeleton class="w-[75%]" />
      </div>
    </div>
  </div>

  <!-- Loaded State -->
  <div v-else class="p-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
    <div class="flex gap-4">
<Card
  v-for="place in places"
  :key="place._id"
  class="min-w-[calc(100%/2.5)] max-w-[250px] relative rounded-lg overflow-hidden"
>
  <img
    :src="place.titleImage"
    alt="card image"
    class="w-full h-[150px] object-cover"
  />

  <!-- Bottom gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

  <!-- Text content -->
  <div class="absolute bottom-2 left-2 right-2 text-white z-10">
    <h3 class="text-sm font-semibold truncate">{{ place.placeName }}</h3>
    <p class="text-xs capitalize">{{ place.district }}</p>
  </div>
</Card>

    </div>
  </div>
    <div class="flex p-2 flex-row relative">
    <img
      @click="toTrackPage()"
      src="https://cdn.jsdelivr.net/gh/arunchamakkalayil/places/banner5.png
"
      width="100%"
      alt=""
    />
    <span class="top-10 left-15 absolute text-lg font-semibold"
      >Nearby Places</span
    >
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaceStore } from "@/stores/placeStore";
import { useRouter } from "vue-router";

const loading = ref(true);
const placeStore = usePlaceStore();
const places = computed(() => placeStore.getPlaces);
const router = useRouter();

const toExplorePage = () => {
  router.push("/explore");
};
const toTrackPage = () => {
  router.push("/track");
};
onMounted(async () => {
  loading.value = true;
  await placeStore.fetchPlaces();
  loading.value = false;
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari, and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge, and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
