import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/layouts/MainView.vue';
import HomeView from '@/views/pages/home/HomeView.vue';
import { useAuthStore } from '@/stores/authStore';
import { backendUrl } from '../../app-globals';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StartUpPage',
      component: () => import('@/views/auth/StartUpLoading.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/auth/SignUp.vue')
    },
    {
      path: '/verify',
      name: 'Verification',
      component: () => import('@/views/auth/EmailVerification.vue')
    },
    {
      path: '/api/verify-email',
      name: 'Email Verification',
      component: () => import('@/views/auth/Verify.vue')
    },
    {
      path: '/',
      component: MainView,
      meta:{requiresAuth: true},
      children: [
        {
          path: 'home',
          name: 'HomePage',
          component: HomeView,
        },
        {
          path: 'track',
          name: 'TrackPage',
          component: ()=> import('@/views/pages/track/TrackView.vue'),
        },
        {
          path: 'explore',
          name: 'ExplorePage',
          component: () => import('@/views/pages/explore/ExploreView.vue'),
        },
        {
          path: 'planner',
          name: 'PlannerPage',
          component: ()=> import('@/views/pages/planner/PlannerView.vue'),
        },
        {
          path: 'profile',
          name: 'ProfilePage',
          component: ()=> import('@/views/pages/profile/ProfileView.vue'),
        },

      ],
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');

  // if (token && !authStore.isAuthenticated) {
  //   try {
  //     // Validate token via API call if needed
  //     const response = await axios.get(`${backendUrl}/api/me`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     authStore.setUser({ user: response.data, token });
  //     if (to.name === 'StartUpPage' || to.name === 'Login') {
  //       return next({ name: 'HomePage' });
  //     }
  //     return next();
  //   } catch (err) {
  //     // Token is invalid or expired
  //     authStore.logout();
  //     return next({ name: 'Login' });
  //   }
  // }

  // // If going to a protected page but not logged in
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   return next({ name: 'Login' });
  // }

  // // If already logged in and trying to access login/signup, redirect to home
  // if ((to.name === 'Login' || to.name === 'Signup') && authStore.isAuthenticated) {
  //   return next({ name: 'HomePage' });
  // }

  next();
});


export default router;
