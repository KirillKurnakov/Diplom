import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/authpage.vue'
import MainPage from '../views/mainpage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/main', component: MainPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
