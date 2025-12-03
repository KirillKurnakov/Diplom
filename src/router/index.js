import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/authpage.vue'
import MainPage from '../views/mainpage.vue'
import SourcePage from '../views/sourcepage.vue'
import FkForm from '../views/fkform.vue'
import Protocols from '../views/protocols.vue'
import Dashboard from '../views/dashboard.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/main', component: MainPage},
  { path: '/main/sourcepage', component: SourcePage},
  { path: '/main/fkform', component: FkForm},
  { path: '/main/protocols', component: Protocols},
  { path: '/main/dashboard', component: Dashboard},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
