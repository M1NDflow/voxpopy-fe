<template>
    <div class="question-grid">
        <QuestionCard :icon="CalendarIcon" color="#094074"
            @select="send('Quels objets ont été débattus dans la session de février ?')">
            Quels objets ont été débattus dans la session de février ?
        </QuestionCard>
        <QuestionCard :icon="MapIcon" color="#FBA028" @select="send('Parle-moi du plan directeur communal 2040')">
            Parle-moi du plan directeur communal 2040
        </QuestionCard>
        <QuestionCard :icon="TruckIcon" color="#E83151"
            @select="send('Quel est la position des partis sur la mobilité douce ?')">
            Quel est la position des partis sur la mobilité douce ?
        </QuestionCard>
        <QuestionCard :icon="UserGroupIcon" color="#0B6E4F"
            @select="send('Résume-moi les trois dernières interventions Mr Alfonso Gomez, maire de Genève')">
            Résume-moi les trois dernières interventions Mr Alfonso Gomez, maire de Genève
        </QuestionCard>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import QuestionCard from './QuestionCard.vue'
import { useMessageStore } from '@/stores/messageStore'

// Import d’icônes solides 24x24
import { CalendarIcon, MapIcon, TruckIcon, UserGroupIcon }
    from '@heroicons/vue/24/solid'

export default defineComponent({
    name: 'QuestionGrid',
    components: { QuestionCard },
    setup() {
        const messageStore = useMessageStore()
        function send(question: string) {
            messageStore.sendMessage(question)
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