import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue';
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr: {
            loading: "Chargement",
            ask_a_question: "Poser une question",
            reasoning_mode: "Mode raisonnement avancé",
            disclaimer: "Le projet ViaDemocratIA peut commettre des erreurs. Il est recommandé de vérifier les informations importantes. Les informations ne sont en aucun cas des conseils politiques"
        }
    }
})



const app = createApp(App);
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(i18n).mount('#app');
