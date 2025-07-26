<template>
  <div class="flex relative flex-col">
    <img class="absolute -z-0 h-min-[33vh] w-full object-cover" src="../../assets/mountains.jpg" alt="Logo" />
    <div class="flex absolute flex-col items-center w-[100%] justify-center">
      <Card class="mt-[50%]  rounded-l-3xl rounded-r-3xl w-[100%] border-none rounded-3xl shadow-none">
        <CardHeader>
          <CardTitle class="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onFormSubmit" class="space-y-4">
            <div class="flex flex-col gap-6">
              <div class="grid gap-3">
                <Label for="email">Email</Label>
                <Input id="email" type="email" v-model:model-value="formData.email" required />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                  {{ errors.email }}
                </p>
              </div>
              <div class="grid gap-3">
                <div class="flex items-center">
                  <Label for="password">Password</Label>
                  <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input v-model:model-value="formData.password" id="password" type="password" required />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </p>
              </div>
              <div class="flex flex-col gap-3">
                <Button type="submit" class="w-full bg-indigo-600">
                  Login
                </Button>
                <!-- <div class="flex items-center justify-center">
                  <div class="border-t border-gray-300 w-1/3"></div>
                  <span class="mx-2 text-sm text-gray-500">Or</span>
                  <div class="border-t border-gray-300 w-1/3"></div>
                </div>

                <Button variant="outline" class="w-full">
                  Login with Google
                </Button> -->
              </div>
            </div>
            <div class="mt-4 text-center text-sm">
              Don't have an account?
              <span @click="goToSignup" class="underline underline-offset-4">
                Sign up
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { z } from "zod";
import axios from "axios";
import { backendUrl } from "../../../app-globals";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label/Label.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});
const errors = ref({});

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const goToSignup = () => {
  router.push({ path: "/signup" });
};

const onFormSubmit = () => {
  const result = schema.safeParse(formData.value);
  if (!result.success) {
    errors.value = Object.fromEntries(
      result.error.errors.map((err) => [err.path[0], err.message])
    );
  } else {
    loginUser();
  }
};

async function loginUser() {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/login`, {
      email: formData.value.email,
      password: formData.value.password,
    });
    await router.push({ path: "/home" });
  } catch (error) {
    console.log(error)
  }
}
</script>
