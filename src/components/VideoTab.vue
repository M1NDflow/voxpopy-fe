<template>
    <div class="video-list">
        <section v-for="(group, index) in groupedVideos" :key="group.dateKey" class="video-day-group">
            <p class="video-day-heading">{{ group.label }}</p>
            <VideoSource v-for="video in group.segments" :key="video.id" :video="video" />
            <hr v-if="index < groupedVideos.length - 1" class="video-day-divider" />
        </section>
        <VideoModal :visible="!!modalStore.modal" @close="modalStore.closeModal()" />
    </div>
</template>

<script lang="ts">
import VideoSource from './VideoSource.vue'
import VideoModal from './VideoModal.vue'
import { defineComponent, watch } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { useVideoModalStore } from '@/stores/modalStore'
import { formatSegmentDate } from '@/types/enriched_segments'

export default defineComponent({
    name: 'VideoTab',
    components: { VideoSource, VideoModal },
    props: {
        messageId: {
            type: String,
            required: true
        },
    },
    setup(props) {
        const messageStore = useMessageStore();
        const modalStore = useVideoModalStore();

        watch(() => messageStore.getMessageById(props.messageId)?.responseData?.segments ?? [],
            (segments) => {
                segments.forEach(seg => {
                    if (seg?.id) {
                        modalStore.ensureSegment(seg.id)
                    }
                })
            }, { immediate: true })

        return { messageStore, modalStore };
    },
    computed: {
        message() {
            return this.messageStore.getMessageById(this.messageId)
        },
        videos() {
            const segments = this.message.responseData?.segments ?? []
            return [...segments].sort((a, b) => this.segmentSortKey(a) - this.segmentSortKey(b))
        },
        groupedVideos() {
            const groups = new Map()
            this.videos.forEach(segment => {
                const dateKey = this.segmentDateKey(segment)
                if (!groups.has(dateKey)) {
                    groups.set(dateKey, {
                        dateKey,
                        label: this.segmentDateLabel(segment),
                        segments: []
                    })
                }
                groups.get(dateKey).segments.push(segment)
            })
            return Array.from(groups.values())
        }
    },
    methods: {
        segmentSortKey(segment) {
            if (!segment?.id) return Number.MAX_SAFE_INTEGER
            const enriched = this.modalStore.segById?.[segment.id]
            const dateSource = enriched?.seance_date ?? segment.seance_date
            const startSecond = enriched?.start_second ?? segment.start_second ?? 0
            const dateValue = dateSource ? new Date(dateSource).getTime() : Number.MAX_SAFE_INTEGER / 2
            return dateValue + (startSecond * 1000)
        },
        segmentDateKey(segment) {
            const dateSource = this.getSegmentDate(segment)
            if (!dateSource) return 'unknown-date'
            const dateObj = new Date(dateSource)
            return [
                dateObj.getFullYear(),
                String(dateObj.getMonth() + 1).padStart(2, '0'),
                String(dateObj.getDate()).padStart(2, '0')
            ].join('-')
        },
        segmentDateLabel(segment) {
            const dateSource = this.getSegmentDate(segment)
            return dateSource ? formatSegmentDate(dateSource) : 'Date inconnue'
        },
        getSegmentDate(segment) {
            if (!segment) return null
            const enriched = segment?.id ? this.modalStore.segById?.[segment.id] : undefined
            return enriched?.seance_date ?? segment.seance_date ?? null
        }
    }
})
</script>

<style scoped>
.video-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.video-day-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.video-day-heading {
    margin: 0;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-subtitle2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.video-day-divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-md) 0;
}
</style>
