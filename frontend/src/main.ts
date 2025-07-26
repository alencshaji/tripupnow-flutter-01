import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import "leaflet/dist/leaflet.css";
import { createBottomSheet } from 'bottom-sheet-vue3';
import 'bottom-sheet-vue3/style.css';

const app = createApp(App);

// Setup Pinia first
const pinia = createPinia();
app.use(pinia);

// Initialize auth store **after** creating Pinia
import { useAuthStore } from './stores/authStore';
const authStore = useAuthStore();

// You no longer need to read token/user from localStorage
// Access token is kept in memory only, refresh token is in HTTP-only cookie

app.use(router);
app.use(createBottomSheet());

app.mount('#app');

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
