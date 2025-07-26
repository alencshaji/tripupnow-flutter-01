<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 shadow-md z-50 flex justify-around items-center px-2 py-1 rounded-t-xl"
    role="navigation"
  >
    <Button
      @click="goToHome"
      class=""
      aria-label="Home"
      variant="ghost"
    >
      <House />
    </Button>

    <Button
      @click="goToExplore"
      class="flex flex-col items-center text-muted-foreground hover:text-primary"
      aria-label="Explore"
      variant="ghost"
    >
      <Search />
    </Button>

    <Button
      @click="goToTrack"
      class="flex flex-col items-center text-muted-foreground hover:text-primary"
      aria-label="Track"
      variant="ghost"
    >
      <MapPinned />
    </Button>

    <Button
      @click="goToPlanner"
      class="flex flex-col items-center text-muted-foreground hover:text-primary"
      variant="ghost"
      aria-label="Planner"
    >
      <NotebookText />
    </Button>
  </footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
import { House, MapPinned, Search, NotebookText } from "lucide-vue-next";

const router = useRouter();

const goToHome = () => {
  router.push({ name: "HomePage" });
};
const goToExplore = () => {
  router.push({ name: "ExplorePage" });
};
const goToTrack = () => {
  router.push({ name: "TrackPage" });
};
const goToPlanner = () => {
  router.push({ name: "PlannerPage" });
};
</script>
