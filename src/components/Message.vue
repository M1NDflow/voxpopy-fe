<template>
    <div class="message container">
        <!-- Header: User Message -->
        <div class="header-container">
            <div v-if="message.is_high_reasoning_effort" class="reasoning-header">
                <SparklesIcon class="icon" />
                <p>Reasoning</p>
            </div>
            <h2 class="message-header">{{ message?.text || '' }}</h2>
        </div>

        <template v-if="message.isLoading">
            <div class="loading-state">
                <LoadingShimmer />
            </div>
        </template>
        <template v-if="message?.responseData?.response?.length > 0">
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
                    <p class="count">{{ message.responseData?.segments.length }}</p>
                </button>
                <button v-if="message.responseData?.documents?.length > 0"
                    :class="{ active: activeTab === 'documents' }" @click="activeTab = 'documents'">
                    <DocumentTextIcon class="icon" />
                    <p>Documents</p>
                    <p class="count">{{ message.responseData?.documents.length }}</p>
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <template v-if="activeTab === 'response'">
                    <AnswerWithSources class="response-text" :message="message"
                        @open-seg="id => handleOpen({ id, type: 'video' })"
                        @open-doc="({ id, url }) => handleOpen({ id, type: 'document', url })" />

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
import AnswerWithSources from './AnswerWithSources.vue'
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { Bars3CenterLeftIcon, DocumentTextIcon, VideoCameraIcon, SparklesIcon } from '@heroicons/vue/24/solid'
import { useVideoModalStore } from '@/stores/modalStore'

export default defineComponent({
    name: 'Message',
    components: { ResponseSource, VideoTab, DocumentTab, VideoModal, LoadingShimmer, Bars3CenterLeftIcon, DocumentTextIcon, VideoCameraIcon, AnswerWithSources, SparklesIcon },
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
                const result = window.open(payload.url, '_blank')
                if (!result) {
                    console.error('Failed to open document in new tab')
                }
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

.header-container {
    display: flow-root;
    justify-content: start;
    align-items: start;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-sm);
}

.message-header {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    white-space: normal;
    word-break: break-word;
    margin: 0;
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
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-sm);
    cursor: pointer;
    display: flex;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    border-bottom: 1px solid transparent;
    border-radius: 0px;
    transition: border-color 0.2s;
}

.tabs button.active {
    border-bottom: 2px solid var(--color-primary-dark);
    color: var(--color-text);
    opacity: 1;
}

.tabs button:not(.active):hover {
    border-bottom: 1px solid rgba(20, 20, 20, 0.629);
}

.response-text {
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    white-space: pre-line;
}

.count {
    font-size: 0.7rem;
    color: rgba(74, 74, 74, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.5rem;
    width: 0.5rem;
    font-weight: var(--font-weight-bold);
    padding: 6px;
    border-radius: 3px;
    background-color: rgba(145, 145, 145, 0.10);
}

.reasoning-header {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-light);
    color: var(--color-primary-dark);
    background-color: var(--color-primary);
    padding: 2px 6px;
    float: left;
    margin: 0 12px 0px 0;
    border-radius: 6px;
    display: flex;
    transform: translateY(0.2em);
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    justify-content: center;
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