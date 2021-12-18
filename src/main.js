import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Icon } from '@iconify/vue'
import spotifyApi from './api/spotify'

const app = createApp(App)

app.component('Icon', Icon)
app.config.globalProperties.spotify = spotifyApi

app.use(router)
app.mount('#app')
