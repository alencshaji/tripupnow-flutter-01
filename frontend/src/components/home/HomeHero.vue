<template>
  <div v-if="loading" class="p-2">
    <Skeleton class="w-full h-[13rem] rounded-lg shadow" />
  </div>
  <Carousel
    v-else
    :plugins="[plugin]"
    @mouseenter="plugin.stop"
    @mouseleave="[plugin.reset(), plugin.play()]"
    class="p-2"
    
  >
    <CarouselContent>
<CarouselItem v-for="item in trendingplaces" :key="item._id">
  <div class="relative rounded-md overflow-hidden">
    <img
      :src="item.titleImage"
      alt=""
      class="rounded-md object-cover w-full h-[13rem]"
    />
    <!-- Shadow overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <!-- Text -->
    <p class="text-lg absolute bottom-3 left-3 text-white font-semibold z-10">
      {{ item.placeName }}
    </p>
  </div>
</CarouselItem>

    </CarouselContent>
    <!-- <CarouselPrevious />
    <CarouselNext /> -->
  </Carousel>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ProductService } from './productService'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import Autoplay from 'embla-carousel-autoplay'
import { usePlaceStore } from '@/stores/placeStore'

interface Product {
  id: string
  name: string
  image: string
  price: number
  category: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const placeStore = usePlaceStore()

const plugin = Autoplay({
  delay: 3000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
})
const trendingplaces:any = computed(()=>placeStore.getTrendingPlaces)

onMounted(async () => {
  loading.value = true;
  placeStore.fetchTrendingPlaces()
  loading.value = false
})
</script>
