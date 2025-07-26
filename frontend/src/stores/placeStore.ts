import { defineStore } from "pinia";
import axios from "../../app-axios";

export const usePlaceStore = defineStore("place", {
  state: () => ({
    places: [],
    trendingPlaces: [],
    searchedPlaces: [],
    nearbyPlaces: [],
    plans: [],
  }),

  actions: {
    async fetchPlaces() {
      const url = "api/places";
      const response = await axios.get(url);
      this.places = response.data.data;
    },
    async searchPlaces(payload: any) {
      const url = `api/places/search?query=${payload.search}`;
      const response = await axios.get(url);
      this.searchedPlaces = response.data;
    },
      async fetchNearByPlaces(payload: any) {
      const url = `api/places/nearby?lat=${payload.lat}&lon=${payload.lon}`;
      const response = await axios.get(url);
      this.nearbyPlaces = response.data;
    },
    async fetchTrendingPlaces() {
      const url = "api/trending";
      const response = await axios.get(url);
      this.trendingPlaces = response.data;
    },
        async generatePlans() {
      const url = "api/places/plans";
      const response = await axios.get(url);
      this.plans = response.data;
    },
  },

  getters: {
    getPlaces: (state) => state.places,
    getTrendingPlaces: (state) => state.trendingPlaces,
    getSearchedPlaces: (state) => state.searchedPlaces,
    getNearbyPlaces: (state) => state.nearbyPlaces,
    getPlans: (state) => state.plans,
  },
});
