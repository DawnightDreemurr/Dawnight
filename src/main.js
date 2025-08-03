import 'vue-fullpage.js/dist/style.css'
import '@/assets/main.css'
import 'qweather-icons/font/qweather-icons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
