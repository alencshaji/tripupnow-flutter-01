<template>
  <div class="background-space">
    <div class="section-one">
      <Button 
        icon="pi pi-angle-left" 
        severity="contrast" 
        variant="text" 
        rounded 
        @click="goBack"  
      />
    </div>
    <ProfileBio />
    <ProfileSettings />
    <div class="logout-container">
      <Button icon="pi pi-sign-out" label="Logout"/>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ProfileBio from './ProfileBio.vue';
import ProfileSettings from './ProfileSettings.vue';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.background-space {
  padding: 10px;
}
.section-one .p-button {
  border: none;
  margin: 4px;
  background-color: var(--surface-card);
  color: var(--text-color-primary);
}
.logout-container{
  margin: 10px;
  border-radius: 10px;
}
.logout-container .p-button{
  width: 100%;
  height: 45px;

}
::v-deep(.logout-container .pi){
color: var(--primary-color-text);
background-color: transparent;
}
::v-deep(.section-one .pi){
color: var(--text-color-primary);
background-color: transparent;
}
::v-deep(.logout-container .p-button-label){
color: var(--primary-color-text);
background-color: transparent;
}
</style>
