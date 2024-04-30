import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/bootstrap-5.3.3-dist/css/bootstrap.min.css'
import '@/assets/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js'


createApp(App).use(router).mount('#app')
