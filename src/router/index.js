import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/authpage.vue'
import MainPage from '../views/mainpage.vue'
import SourcePage from '../views/sourcepage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/main', component: MainPage},
  { path: '/main/sourcepage', component: SourcePage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
