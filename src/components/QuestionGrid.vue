<template>
    <div class="question-grid">
        <QuestionCard :icon="CalendarIcon" color="#FBA028"
            @select="send('Quels objets ont été débattus dans la session de février ?')">
            Quels objets ont été débattus dans la session de février ?
        </QuestionCard>
        <QuestionCard :icon="MapIcon" color="#FBA028" @select="send('Parle-moi du plan directeur communal 2040')">
            Parle-moi du plan directeur communal 2040
        </QuestionCard>
        <QuestionCard :icon="TruckIcon" color="#FBA028"
            @select="send('Quelle est la position des partis sur la mobilité douce ?')">
            Quelle est la position des partis sur la mobilité douce ?
        </QuestionCard>
        <QuestionCard :icon="UserGroupIcon" color="#FBA028"
            @select="send('Résume-moi les trois dernières interventions de Mr Alfonso Gomez')">
            Résume-moi les trois dernières interventions de Mr Alfonso Gomez
        </QuestionCard>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuestionCard from './QuestionCard.vue'
import { useMessageStore } from '@/stores/messageStore'
import { useConversationSession } from '@/composables/useConversationSession'

// Import d’icônes solides 24x24
import { CalendarIcon, MapIcon, TruckIcon, UserGroupIcon }
    from '@heroicons/vue/24/solid'

export default defineComponent({
    name: 'QuestionGrid',
    components: { QuestionCard },
    setup() {
        const messageStore = useMessageStore()
        const { ensureSession } = useConversationSession()
        function send(question: string) {
            const sessionId = ensureSession(question)
            messageStore.sendMessage(question, sessionId)
        }
        return { CalendarIcon, MapIcon, TruckIcon, UserGroupIcon, send }
    }
})
</script>

<style scoped>
.question-grid {
    display: flex;
    gap: var(--spacing-lg);
    width: 100%;
    max-width: 800px;
}
</style>
