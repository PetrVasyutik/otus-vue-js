import './assets/main.css'
import './assets/forms.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { setupMockGraphQLServer } from '@/graphql/mock-server'

setupMockGraphQLServer()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
