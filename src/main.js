import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "vue3-easy-data-table/dist/style.css";

import './assets/global.css'

createApp(App).use(router).mount('#app')
