<template>
  <h3 class="pl-4 pt-2 text-lg font-semibold">Trip Packages</h3>
  <div v-if="loading" class="p-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
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

  <div v-else class="p-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
    <div class="flex gap-4">
      <Card v-for="(place, index) in places" :key="index" class="min-w-[calc(100%/2.5)] max-w-[250px]">
        <img :src="place.image" alt="card image" class="w-full h-[90px] object-cover rounded-t-lg" />
        <div class="p-2">
          <h3 class="text-sm font-semibold mb-1">{{ place.name }}</h3>
          <p class="text-xs">{{ place.location }}</p>
        </div>
      </Card>
    </div>
  </div>
  <br><br>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const loading = ref(true);
const places = [
  {
    name: 'Munnar',
    location: 'Idukki, Kerala',
    rating: '4.8',
    image:
      'https://images.pexels.com/photos/13045091/pexels-photo-13045091.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
  },
  {
    name: 'Vagamon',
    location: 'Idukki, Kerala',
    rating: '4.7',
    image:
      'https://images.pexels.com/photos/14844302/pexels-photo-14844302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Meesapulimala',
    location: 'Idukki, Kerala',
    rating: '4.9',
    image: 'https://munnarinfo.in/uploads/profile/1531033411kvutiekb532626.jpg',
  },
  {
    name: 'Illikal Kallu',
    location: 'Kottayam, Kerala',
    rating: '4.6',
    image:
      'https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Flarge-desktop%2Fillikkal-kallu-1727449122_0357636afcabf650ca90.webp&w=1920&q=75',
  },
];

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 3000);
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