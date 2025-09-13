<template>
    <div class="document-list">
        <DocumentSource v-for="doc in messageStore.getMessageById(messageId).responseData?.documents" :key="doc.id"
            :document="doc" />
    </div>
</template>

<script lang="ts">
import DocumentSource from './DocumentSource.vue'
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore'

export default defineComponent({
    name: 'DocumentTab',
    components: { DocumentSource },
    props: {
        messageId: {
            type: String,
            required: true
        },
    },
    setup() {
        const messageStore = useMessageStore();
        return { messageStore };
    },
    computed: {
        message() {
            return this.messageStore.getMessageById(this.messageId)
        }
    },
})
</script>

<style scoped>
.document-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}
</style>