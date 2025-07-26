<template>
  <!-- <div class="p-2 flex flex-row relative">
    <img  @click="toExplorePage()" src="../../assets/banner1.png" width="100%" alt="">
<span class="top-15 left-28 absolute text-lg font-semibold">Browse By  Search</span>
  </div> -->
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const toExplorePage = () =>{
  router.push('/explore')
}

</script>
