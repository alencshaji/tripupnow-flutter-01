<template>
  <div class="flex relative flex-col">
    <img class="absolute -z-0 h-min-[33vh] w-full object-cover" src="../../assets/mountains.jpg" alt="Background" />
    <div class="flex absolute flex-col items-center w-[100%] justify-center">
      <Card class="mt-[50%] rounded-l-3xl rounded-r-3xl w-[100%] border-none rounded-3xl shadow-none">
        <CardHeader>
          <CardTitle class="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onFormSubmit" class="space-y-4">
            <div class="flex flex-col gap-6">
              <div class="grid gap-3">
                <Label for="name">Name</Label>
                <Input id="name" type="text" v-model:model-value="formData.name" required />
                <p v-if="errors.name" class="text-red-500 text-sm mt-1">
                  {{ errors.name }}
                </p>
              </div>
              <div class="grid gap-3">
                <Label for="email">Email</Label>
                <Input id="email" type="email" v-model:model-value="formData.email" required />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                  {{ errors.email }}
                </p>
              </div>
              <div class="grid gap-3">
                <Label for="password">Password</Label>
                <Input id="password" type="password" v-model:model-value="formData.password" required />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </p>
              </div>
              <div class="grid gap-3">
                <Label for="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" v-model:model-value="formData.confirmPassword" required />
                <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
                  {{ errors.confirmPassword }}
                </p>
              </div>
              <div class="flex flex-col gap-3">
                <Button type="submit" class="w-full bg-indigo-600">
                  Sign Up
                </Button>
              </div>
            </div>
            <div class="mt-4 text-center text-sm">
              Already have an account?
              <span @click="goToLogin" class="underline underline-offset-4 cursor-pointer">
                Log In
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import { backendUrl } from '../../../app-globals'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Label from '@/components/ui/label/Label.vue';
import { useRouter } from 'vue-router'


const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})
const router = useRouter()

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const goToLogin = () => {
  router.push({ path: '/login' })
}

const onFormSubmit = () => {
  const result = schema.safeParse(formData.value)

  if (!result.success) {
    errors.value = Object.fromEntries(result.error.errors.map((err) => [err.path[0], err.message]))
  } else {
    errors.value = {}
    signUpUser()
  }
}

async function signUpUser() {
  try {
    const { name, email, password } = formData.value;

    // 1. Register user
    await axios.post(`${backendUrl}/api/auth/signup`, { name, email, password });

    // 2. Trigger OTP generation
    await axios.post(`${backendUrl}/api/auth/send-otp`, { email });

    // 3. Redirect to OTP verification with email in query
    router.push({ path: '/verify', query: { email } });

  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
  }
}

</script>