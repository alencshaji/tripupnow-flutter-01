<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePlaceStore } from "@/stores/placeStore";
import NearbyMapPopup from "./NearbyMapView.vue";
import { RefreshCcw } from "lucide-vue-next";

const userLocation = ref<[number, number] | null>(null);
const showScanButton = ref(true);
const loading = ref(false);
const showMapPopup = ref(false);

const placeStore = usePlaceStore();
const nearbyPlaces: any = computed(() => placeStore.getNearbyPlaces);

async function scanNearbyPlaces() {
  if (!userLocation.value) return;

  const [lon, lat] = userLocation.value;
  loading.value = true;

  try {
    await placeStore.fetchNearByPlaces({ lat, lon });
    showScanButton.value = false;
  } catch (err) {
    console.error("Failed to fetch places:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      userLocation.value = [pos.coords.longitude, pos.coords.latitude];
      navigator.geolocation.clearWatch(watchId);
    },
    (err) => console.error("Geo error:", err),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-4">
    <!-- Scan Button -->
    <div v-if="showScanButton" class="flex justify-center items-center h-[50vh]">
      <button
        @click="scanNearbyPlaces"
        class="bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {{ loading ? "Scanning..." : "Scan Nearby Places" }}
      </button>
    </div>

    <!-- List -->
    <div v-else>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-blue-700 dark:text-blue-400">Nearby Places</h2>

        <button
          @click="scanNearbyPlaces"
          class="bg-gray-200 dark:bg-slate-700 text-sm px-4 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          <RefreshCcw :class="{ 'animate-spin': loading }" />
        </button>

        <button
          @click="showMapPopup = true"
          class="bg-gray-200 dark:bg-slate-700 text-sm px-4 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          Map View
        </button>
      </div>

      <div
        v-if="nearbyPlaces.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 mt-10"
      >
        No nearby places found.
      </div>

      <div v-else class="pt-4 space-y-5">
        <div
          v-for="place in nearbyPlaces"
          :key="place._id"
          class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <img
            :src="place.titleImage"
            alt="img"
            class="w-16 h-16 rounded object-cover"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-base">{{ place.placeName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ place.description }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {{ place.distance_km }} km • ~{{ place.time_min }} min
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Modal -->
    <NearbyMapPopup
      v-if="showMapPopup"
      :places="nearbyPlaces"
      :userLocation="userLocation"
      @close="showMapPopup = false"
    />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
