<template>
    <div class="question-grid">
        <QuestionCard :icon="CalendarIcon" color="#094074"
            @select="send('Quel parti et quel intervenant a traité la motion concernant le pont du mont blanc ?')">
            Quel parti et quel intervenant a traité la motion concernant le pont du mont blanc ?
        </QuestionCard>
        <QuestionCard :icon="MapIcon" color="#FBA028" @select="send('Parle-moi du plan directeur communal 2040')">
            Parle-moi du plan directeur communal 2040
        </QuestionCard>
        <QuestionCard :icon="TruckIcon" color="#E83151"
            @select="send('Quel est la position des partis sur la mobilité douce ?')">
            Quel est la position des partis sur la mobilité douce ?
        </QuestionCard>
        <QuestionCard :icon="UserGroupIcon" color="#0B6E4F"
            @select="send('Quels est la politique des Verts dernièrement ?')">
            Quels est la politique des Verts dernièrement ?
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
