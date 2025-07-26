<template>
  <div class="p-8 flex flex-col items-center gap-4 rounded-lg shadow-2xl bg-card">
    <Avatar :image="avatarImg" size="xlarge" class="rounded-full" />
    <h3 class="text-lg font-semibold text-primary">ARUN C SHAJI</h3>
    <p class="text-sm text-primary">6282357929</p>

    <div class="flex gap-2 pt-2">
      <Button
        class="flex items-center gap-2 text-white bg-gradient-to-r from-pink-400 to-pink-600 shadow-md hover:shadow-lg"
      >
        <i class="pi pi-bookmark"></i>
        <span>Saved</span>
      </Button>

      <Separator orientation="vertical" />

      <Button
        class="flex items-center gap-2 text-white bg-gradient-to-r from-blue-400 to-cyan-400 shadow-md hover:shadow-lg"
      >
        <i class="pi pi-share-alt"></i>
        <span>Share</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import avatarImg from '@/assets/avatar.png';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
</script>