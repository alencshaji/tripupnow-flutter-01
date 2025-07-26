import { defineStore } from 'pinia'
import axios from '../../app-axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
    user: null as null | { email: string }, // adjust to your user shape
  }),

  actions: {
    async login(payload: { email: string; password: string }) {
      const res = await axios.post('api/auth/login', payload);

      this.accessToken = res.data.accessToken;
      this.user = res.data.user; // adjust if needed
    },

    async refreshToken() {
      try {
        const res = await axios.post('api/auth/refresh', {}, { withCredentials: true });
        this.accessToken = res.data.accessToken;
        return res.data.accessToken;
      } catch (err) {
        this.accessToken = '';
        this.user = null;
        throw err;
      }
    },

    logout() {
      this.accessToken = '';
      this.user = null;
      axios.post('api/auth/logout', {}, { withCredentials: true }); // optional
    },
  },
});
