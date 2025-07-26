<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { OlaMaps } from "olamaps-web-sdk";
import { olaMapUrl } from "../../../../app-globals";
import { useColorMode } from "@vueuse/core";

const props = defineProps<{
  places: any[];
  userLocation?: [number, number] | null;
}>();

const emit = defineEmits(["close"]);

const mapElement = ref<HTMLElement | null>(null);
const olaMapsInstance = ref<any>(null);
const myMap = ref<any>(null);
const mode = useColorMode();

function getStyleUrl() {
  return mode.value === "dark"
    ? "https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard-mr/style.json"
    : "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json";
}

function renderMap() {
  if (!mapElement.value || props.places.length === 0) return;

  const centerLat = parseFloat(props.places[0].latitude);
  const centerLon = parseFloat(props.places[0].longitude);

  olaMapsInstance.value = new OlaMaps({ apiKey: olaMapUrl });

  myMap.value = olaMapsInstance.value.init({
    container: mapElement.value!,
    center: [centerLon, centerLat],
    zoom: 13,
    style: getStyleUrl(),
  });

  // User marker
  if (props.userLocation) {
    const userPopup = olaMapsInstance.value
      .addPopup({ offset: [0, -30], anchor: "bottom" })
      .setText("You are here");

    olaMapsInstance.value
      .addMarker({ color: "#ff0000", anchor: "bottom", offset: [0, -15] })
      .setLngLat([props.userLocation[0], props.userLocation[1]])
      .setPopup(userPopup)
      .addTo(myMap.value);

    userPopup.addTo(myMap.value);
  }

  // Place markers
  props.places.forEach((place) => {
    const popup = olaMapsInstance.value
      .addPopup({ offset: [0, -30], anchor: "bottom" })
      .setText(place.placeName);

    olaMapsInstance.value
      .addMarker({ color: "#0077ff", anchor: "bottom", offset: [0, -15] })
      .setLngLat([parseFloat(place.longitude), parseFloat(place.latitude)])
      .setPopup(popup)
      .addTo(myMap.value);

    popup.addTo(myMap.value);
  });
}

onMounted(() => {
  renderMap();
});

// Watch dark/light mode change and reload map
watch(mode, () => {
  if (myMap.value) {
    myMap.value.remove();
    renderMap();
  }
});
</script>

<template>
  <div class="fixed inset-0 bg-opacity-40 flex items-center justify-end z-50">
    <div
      class="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg w-[100vw] h-[85vh] overflow-hidden"
    >
      <button
        @click="emit('close')"
        class="absolute top-2 right-2 z-10 bg-white dark:bg-slate-800 dark:text-white text-gray-800 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-sm"
      >
        ✕ Close
      </button>

      <div ref="mapElement" class="w-full h-full" />
    </div>
  </div>
</template>
