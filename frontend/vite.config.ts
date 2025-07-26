import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'TripUpNow',
        short_name: 'TUN',
        theme_color: "#1e293b",
        background_color: "#1e293b",
        display: "standalone",
        prefer_related_applications: false,
        icons: [
          {
            src: '/TripUpNow.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/TripUpNow.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
