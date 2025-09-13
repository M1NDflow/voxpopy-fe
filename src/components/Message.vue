<template>
    <div class="message container">
        <!-- Header: User Message -->
        <h2 class="message-header">{{ message?.text || '' }}</h2>

        <template v-if="message.isLoading">
            <div class="loading-state">
                <LoadingShimmer />
            </div>
        </template>
        <template v-else>

            <!-- Tabs -->
            <div class="tabs">
                <button :class="{ active: activeTab === 'response' }" @click="activeTab = 'response'">
                    <Bars3CenterLeftIcon class="icon" />
                    <p>Réponse</p>
                </button>
                <button v-if="message.responseData?.segments?.length > 0" :class="{ active: activeTab === 'videos' }"
                    @click="activeTab = 'videos'">
                    <VideoCameraIcon class="icon" />
                    <p>Vidéos</p>
                </button>
                <button v-if="message.responseData?.documents?.length > 0"
                    :class="{ active: activeTab === 'documents' }" @click="activeTab = 'documents'">
                    <DocumentTextIcon class="icon" />
                    <p>Documents</p>
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <template v-if="activeTab === 'response'">
                    <p class="response-text">
                        {{ message.responseData?.response }}
                    </p>

                    <div class="source-cards-wrapper"
                        v-if="message.responseData?.segments?.length > 0 || message.responseData?.documents?.length > 0">
                        <p class="sources-footer">
                            Sources ({{ message.responseData?.documents.length }} Documents, {{
                                message.responseData?.segments.length }} Vidéos)
                        </p>
                        <div class="source-cards-responses">
                            <ResponseSource v-for="(vid, i) in message.responseData?.segments" :key="vid.id"
                                :id="vid.id" :type="'video'" :title="vid.title" :url="vid.url" @open="handleOpen" />
                            <ResponseSource v-for="(doc, i) in message.responseData?.documents" :key="doc.id"
                                :id="doc.id" :type="'document'" :title="doc.title" :url="doc.document_url"
                                @open="handleOpen" />
                        </div>
                    </div>
                </template>
                <template v-else-if="activeTab === 'videos' && message.responseData?.segments?.length > 0">
                    <VideoTab :messageId="messageId" />
                </template>
                <template v-else-if="activeTab === 'documents' && message.responseData?.documents?.length > 0">
                    <DocumentTab :messageId="messageId" />
                </template>
                <VideoModal v-if="videoModalVisible" :visible="true" @close="closeModal" />
            </div>

        </template>
    </div>
</template>

<script lang="ts">
import ResponseSource from './ResponseSource.vue' // Create a simple ResponseSource component
import VideoTab from './VideoTab.vue'
import LoadingShimmer from './LoadingShimmer.vue'
import DocumentTab from './DocumentTab.vue'
import VideoModal from './VideoModal.vue'
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { Bars3CenterLeftIcon, DocumentTextIcon, VideoCameraIcon } from '@heroicons/vue/24/solid'
import { useVideoModalStore } from '@/stores/modalStore'

export default defineComponent({
    name: 'Message',
    components: { ResponseSource, VideoTab, DocumentTab, VideoModal, LoadingShimmer, Bars3CenterLeftIcon, DocumentTextIcon, VideoCameraIcon },
    props: {
        messageId: {
            type: String,
            required: true
        },
    },
    setup() {
        const messageStore = useMessageStore();
        const modalStore = useVideoModalStore();
        return { messageStore, modalStore };
    },
    computed: {
        message() {
            return this.messageStore.getMessageById(this.messageId)
        }
    },
    data() {
        return {
            tabs: ['response', 'videos', 'documents'],
            activeTab: 'response',
            videoModalVisible: false,
        }
    },
    methods: {
        handleOpen(payload: { id: string; type: 'video' | 'document'; url?: string }) {
            if (payload.type === 'video') {
                // open the store-driven modal for this segment id
                this.modalStore.openSegmentModal(payload.id)
                this.videoModalVisible = true
            } else if (payload.type === 'document' && payload.url) {
                window.open(payload.url, '_blank')
            }
        },
        closeModal() {
            this.modalStore.closeModal()
            this.videoModalVisible = false
        }
    },
})
</script>

<style scoped>
.message {
    padding: var(--spacing-md) var(--spacing-xl);
    width: 100%;
    color: var(--color-text);
    box-sizing: border-box;
}

.loading-state {
    padding: 0;
    color: var(--color-text-secondary);
    font-style: italic;
}

.message-header {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-md);
    white-space: normal;
    word-break: break-word;
}

.tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
}

.tabs button {
    background: none;
    border: none;
    font-weight: 500;
    padding: var(--spacing-sm);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    border-bottom: 2px solid transparent;
    border-radius: 0px;
    transition: border-color 0.2s;
}

.tabs button.active {
    border-color: var(--color-primary-dark);
}

.response-text {
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    white-space: pre-line;
}

.source-cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
}

.source-cards-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: var(--spacing-sm);
    gap: var(--spacing-sm);
}

.source-cards-responses {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: scroll;
    gap: var(--spacing-sm);
}

.sources-footer {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}
</style>