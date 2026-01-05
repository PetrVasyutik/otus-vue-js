import './assets/main.css'
import './assets/forms.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { setupMockGraphQLServer } from '@/graphql/mock-server'
import { setupMockWebSocketServer } from '@/websocket/mock-server'

// Настраиваем mock серверы
setupMockGraphQLServer()
setupMockWebSocketServer()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
