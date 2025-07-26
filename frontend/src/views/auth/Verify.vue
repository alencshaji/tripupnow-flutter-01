<template>
    <div class="background">
      <div class="container">
        <div class="card">
          <img src="../../assets/TripUpNow2.png" width="100px" alt="Logo" class="logo" />
          <h2 class="form-title">Email Verification</h2>
  
          <p v-if="!error && !verified">Verifying your email. Please wait...</p>
          <p v-if="verified" class="success-message">Your email has been successfully verified! You can now proceed to <a href="/login">Login</a>.</p>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import { backendUrl } from '../../../app-globals';
  const route = useRoute();
  const router = useRouter();
  const verified = ref(false);
  const error = ref("");
  
  const verifyEmail = async () => {
    const token = route.query.token;
    if (!token) {
      error.value = "Invalid verification link.";
      return;
    }
  
    try {
      const response = await axios.get(`${backendUrl}/api/verify-email?token=${token}`);
      verified.value = true;
    } catch (err) {
      error.value = err.response?.data?.message || "Email verification failed.";
    }
  };
  
  onMounted(() => {
    verifyEmail();
  });
  </script>
  
  <style scoped>
  .background {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .container {
    max-width: 400px;
    width: 100%;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .success-message {
    color: green;
  }
  
  .error-message {
    color: red;
  }
  </style>
  