<template>
  <div v-if="show" class="fixed inset-0 z-50 flex flex-col justify-end">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-opacity-40"
      @click="emit('close')"
    />

    <!-- Bottom Sheet -->
    <div
      ref="sheet"
      class="relative bg-white rounded-t-xl shadow-lg overflow-hidden"
      :class="isSnapping ? 'transition-transform duration-300 ease-in-out' : ''"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <!-- Drag Handle -->
      <div
        class="w-full flex justify-center py-2 cursor-grab"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <div class="h-1.5 w-12 bg-gray-300 rounded-full"></div>
      </div>

      <!-- Content -->
      <div class="max-h-[80vh] overflow-y-auto px-4 pb-6 pt-2 space-y-4">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <!-- Title & Main Image -->
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-blue-700">{{ place?.placeName }}</h2>
          <img
            v-if="place?.titleImage"
            :src="place.titleImage"
            alt="Main Image"
            class="w-full rounded-lg object-cover h-48"
          />
        </div>

        <!-- Location Info -->
        <div class="text-sm text-gray-600">
          <p><strong>State:</strong> {{ place?.state }}</p>
          <p><strong>District:</strong> {{ place?.district }}</p>
          <p><strong>Category:</strong> {{ place?.category }}</p>
          <p><strong>Best Time to Visit:</strong> {{ place?.timeToVisit }}</p>
        </div>

        <!-- Highlights -->
        <div v-if="place?.highlights" class="text-gray-700">
          <h3 class="text-lg font-semibold text-blue-600">Highlights</h3>
          <p>{{ place.highlights }}</p>
        </div>

        <!-- Description -->
        <div v-if="place?.description">
          <h3 class="text-lg font-semibold text-blue-600">About the Place</h3>
          <p class="text-gray-700">{{ place.description }}</p>
        </div>

        <!-- Optional Images -->
        <div v-if="place?.optionalImage1 || place?.optionalImage2" class="space-y-2">
          <h3 class="text-lg font-semibold text-blue-600">More Images</h3>
          <div class="flex gap-4 overflow-x-auto">
            <img
              v-if="place.optionalImage1"
              :src="place.optionalImage1"
              class="w-48 h-32 rounded-lg object-cover"
            />
            <img
              v-if="place.optionalImage2"
              :src="place.optionalImage2"
              class="w-48 h-32 rounded-lg object-cover"
            />
          </div>
        </div>

        <!-- Map Section -->
        <div v-if="place?.gmap" class="space-y-2">
          <h3 class="text-lg font-semibold text-blue-600">Google Map</h3>
          <iframe
            :src="`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`"
            class="w-full h-48 rounded-lg"
            allowfullscreen
          ></iframe>
          <a
            :href="place.gmap"
            target="_blank"
            class="text-blue-600 underline text-sm"
          >
            Open in Google Maps →
          </a>
        </div>

        <!-- Tags -->
        <div v-if="place?.tags" class="text-sm text-gray-600">
          <h3 class="text-lg font-semibold text-blue-600">Tags</h3>
          <p>{{ place.tags }}</p>
        </div>

        <!-- Footer Button -->
        <div class="mt-6 flex justify-center">
          <button
            @click="emit('close')"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  place: {
    placeName?: string;
    titleImage?: string;
    optionalImage1?: string;
    optionalImage2?: string;
    state?: string;
    district?: string;
    category?: string;
    timeToVisit?: string;
    description?: string;
    highlights?: string;
    gmap?: string;
    latitude?: string;
    longitude?: string;
    tags?: string;
  } | null;
}>();

const emit = defineEmits(["close"]);

const translateY = ref(0);
const isSnapping = ref(true);
const startY = ref(0);
const currentY = ref(0);

const snapPoints = [
  0,
  window.innerHeight * 0.1,
  window.innerHeight * 0.3,
  window.innerHeight * 0.6,
  window.innerHeight * 0.9,
];

watch(
  () => props.show,
  (val) => {
    if (val) {
      isSnapping.value = true;
      translateY.value = snapPoints[2];
    }
  }
);

function startDrag(e: TouchEvent | MouseEvent) {
  isSnapping.value = false;
  startY.value = "touches" in e ? e.touches[0].clientY : e.clientY;

  if (!(e instanceof TouchEvent)) {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
  }
}

function onDrag(e: TouchEvent | MouseEvent) {
  if (!startY.value) return;

  currentY.value = "touches" in e ? e.touches[0].clientY : e.clientY;
  const diff = currentY.value - startY.value;
  translateY.value = Math.min(
    window.innerHeight,
    Math.max(0, translateY.value + diff)
  );
  startY.value = currentY.value;
}

function endDrag() {
  const vh = window.innerHeight;
  isSnapping.value = true;

  const closest = snapPoints.reduce((prev, curr) =>
    Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value)
      ? curr
      : prev
  );

  translateY.value = closest;

  if (translateY.value >= vh * 0.88) {
    emit("close");
  }

  startY.value = 0;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", endDrag);
}
</script>

<style scoped>
html,
body {
  overscroll-behavior: contain;
  touch-action: none;
}
</style>
