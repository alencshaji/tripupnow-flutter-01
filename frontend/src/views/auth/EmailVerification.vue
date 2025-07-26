<template>
  <div class="flex relative flex-col min-h-screen">
    <img
      class="absolute top-0 left-0 w-full h-[33vh] object-cover -z-0"
      src="../../assets/mountains.jpg"
      alt="Background"
    />
    <div class="flex absolute top-1/3 w-full justify-center">
      <Card class="w-[90%] max-w-md mx-auto p-6 shadow-lg bg-white rounded-3xl z-10">
        <CardHeader class="text-center space-y-2">
          <Mail size="50" class="text-indigo-600 mx-auto" />
          <CardTitle class="text-2xl">Enter OTP</CardTitle>
          <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <input
            v-model="otp"
            type="text"
            maxlength="6"
            class="w-full px-4 py-2 text-center border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter OTP"
          />
          <Button class="w-full bg-indigo-600 text-white" @click="verifyOtp">Verify</Button>
          <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { backendUrl } from '../../../app-globals';
import { Mail } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const otp = ref('');
const error = ref('');
const route = useRoute();
const router = useRouter();
const email = ref(route.query.email || '');

const verifyOtp = async () => {
  error.value = '';
  if (otp.value.length !== 6) {
    error.value = 'OTP must be 6 digits.';
    return;
  }

  try {
    const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
      email: email.value,
      otp: otp.value,
    });
    await router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid OTP. Please try again.';
  }
};
</script>
