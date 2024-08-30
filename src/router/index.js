import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      component: () => import('../views/LogIn.vue')
    },
    {
      path: '/todolist',
      component: () => import('../views/TodoList.vue'),
    }
  ]
})

export default router
