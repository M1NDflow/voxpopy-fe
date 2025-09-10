<template>
    <div class="document-list">
        <DocumentSource v-for="doc in documents" :key="doc.id" :document="doc" />
    </div>
</template>

<script>
import DocumentSource from './DocumentSource.vue'

export default {
    name: 'DocumentTab',
    components: { DocumentSource },
    data() {
        return {
            documents: [
                {
                    id: 1,
                    title: 'Délibération: PRD-371 SAFCO',
                    description:
                        'Ce passage se situe au sein du vote des urgences tenu lors de la séance du conseil municipal de Genève du mardi 4 février 2025, débutée à 20h31. Il correspond à la cinquième urgence examinée : une motion déposée par le groupe MCG...',
                    url: '#'
                },
                {
                    id: 2,
                    title: 'Rapport préliminaire sur la sécurité du pont du Mont-Blanc',
                    description:
                        'Ce passage se situe au sein du vote des urgences tenu lors de la séance du conseil municipal de Genève du mardi 4 février 2025, débutée à 20h31. Il correspond à la cinquième urgence examinée : une motion déposée par le groupe MCG...',
                    url: '#'
                }
            ]
        }
    }
}
</script>

<style scoped>
.document-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}
</style>