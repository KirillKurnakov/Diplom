import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/authpage.vue'
import MainPage from '../views/mainpage.vue'
import SourcePage from '../views/source.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/main', component: MainPage},
  { path: '/source', component: SourcePage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
