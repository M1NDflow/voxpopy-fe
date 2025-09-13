<template>
    <div class="video-list">
        <VideoSource v-for="video in videos" :key="video.id" :video="video" />
        <VideoModal :visible="!!modalStore.modal" @close="modalStore.closeModal()" />
    </div>
</template>

<script lang="ts">
import VideoSource from './VideoSource.vue'
import VideoModal from './VideoModal.vue'
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { useVideoModalStore } from '@/stores/modalStore'

export default defineComponent({
    name: 'VideoTab',
    components: { VideoSource, VideoModal },
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
        },
        videos() {
            return this.message.responseData?.segments ?? []
        }
    },
})
</script>

<style scoped>
.video-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}
</style>