<template>
  <div
    class="h-screen w-full relative bg-cover bg-center flex items-end justify-center"
    style="background-image: url('https://images.pexels.com/photos/2739010/pexels-photo-2739010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
  >
    <div class="absolute inset-0 bg-black/60"></div>

    <p
      class="absolute top-1/4 text-white text-xl md:text-2xl font-light italic text-center px-4 font-josefin z-10"
    >
      "Collect moments, not things."
    </p>

    <div class="mb-10 z-10">
      <div class="w-10 h-10 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'Login' })
  }, 2000)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500&display=swap');

.font-josefin {
  font-family: 'Josefin Sans', sans-serif;
}
</style>
