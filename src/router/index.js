import { createRouter, createWebHistory } from 'vue-router'
import Tickets from '../pages/Ticket/Tickets.vue'
import BlogsMainPage from '@/pages/Blogs/MainPage.vue'
import Login from '@/pages/Blogs/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'blogs',
      component: BlogsMainPage,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    }
  ],
})

export default router
