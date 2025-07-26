<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { OlaMaps } from "olamaps-web-sdk";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { olaMapUrl } from "../../../../app-globals";
import Button from "@/components/ui/button/Button.vue";
import { usePlaceStore } from "@/stores/placeStore";
import PlaceDetails from "@/components/places/PlaceDetails.vue";
import Input from "@/components/ui/input/Input.vue";
import { X } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";

const mapElement = ref<HTMLElement | null>(null);
const userLocation = ref<[number, number] | null>(null);
const olaMapsInstance = ref<any>(null);
const myMap = ref<any>(null);
const marker = ref<any>(null);

const searchQuery = ref("");
const showDropdown = ref(true);
const selectedPlace = ref<{
  name: string;
  coords: [number, number];
  placeName?: string;
} | null>(null);
const showDialog = ref(false);

const placeStore = usePlaceStore();
const mode = useColorMode();
const searchedPlaces: any = computed(() => placeStore.getSearchedPlaces);

function getStyleUrl() {
  return mode.value === "dark"
    ? "https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard-mr/style.json"
    : "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json";
}

function renderMap() {
  if (!mapElement.value || !userLocation.value) return;

  const [lon, lat] = userLocation.value;

  olaMapsInstance.value = new OlaMaps({ apiKey: olaMapUrl });

  myMap.value = olaMapsInstance.value.init({
    container: mapElement.value!,
    center: [lon, lat],
    zoom: 13,
    style: getStyleUrl(),
  });

  const popup = olaMapsInstance.value
    .addPopup({ offset: [0, -30], anchor: "bottom" })
    .setText("You are here!");

  marker.value = olaMapsInstance.value
    .addMarker({ color: "#ff0000", anchor: "bottom", offset: [0, -15] })
    .setLngLat([lon, lat])
    .setPopup(popup)
    .addTo(myMap.value);

  popup.addTo(myMap.value);
}

function flyToPlace(place: any) {
  selectedPlace.value = place;

  const lat = parseFloat(place.latitude);
  const lon = parseFloat(place.longitude);

  myMap.value.setCenter([lon, lat]);
  myMap.value.setZoom(15);

  const popup = olaMapsInstance.value
    .addPopup({ offset: [0, -30], anchor: "bottom" })
    .setText(place.placeName);

  if (marker.value) {
    marker.value.setLngLat([lon, lat]).setPopup(popup);
  } else {
    marker.value = olaMapsInstance.value
      .addMarker({ color: "#0077ff", anchor: "bottom", offset: [0, -15] })
      .setLngLat([lon, lat])
      .setPopup(popup)
      .addTo(myMap.value);
  }

  popup.addTo(myMap.value);
}

function handleSelect(place: any) {
  flyToPlace(place);
  searchQuery.value = place.placeName;
  showDropdown.value = false;
  selectedPlace.value = place;
  showDialog.value = true;
}

const showSearchedPlaces = (val: any) => {
  showDropdown.value = true;
  placeStore.searchPlaces({ search: val });
};

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      userLocation.value = [lon, lat];
      renderMap();
    },
    (err) => console.error("Geolocation error:", err),
    { enableHighAccuracy: true }
  );
});

watch(mode, () => {
  if (myMap.value) {
    myMap.value.remove();
    renderMap();
  }
});
</script>

<template>
  <div class="p-4 absolute z-10 w-full max-w-md">
    <Command>
      <!-- Search Input with Icon -->
      <div class="relative">
        <Input
          class="pl-10 h-10 w-full"
          @input="showSearchedPlaces(searchQuery)"
          v-model="searchQuery"
          placeholder="Search a place..."
        />
        <div
          class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
            />
          </svg>
        </div>
      </div>

      <CommandList
        v-if="
          showDropdown &&
          searchedPlaces?.length > 0 &&
          searchQuery.trim() !== ''
        "
      >
        <CommandGroup>
          <CommandItem
            v-for="place in searchedPlaces"
            :key="place._id"
            @click="handleSelect(place)"
            class="cursor-pointer"
            :value="place.placeName"
          >
            {{ place.placeName }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>

  <div ref="mapElement" style="height: 100vh; width: 100%"></div>

  <PlaceDetails
    :show="showDialog"
    :place="selectedPlace"
    @close="showDialog = false"
  />
</template>

<style scoped>
.command {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease;
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
