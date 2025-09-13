<template>
    <div class="video-card" @click="handleClick">
        <div v-if="!!(seg?.playback_id)" class="video-thumbnail">
            <img :src="`https://image.mux.com/${seg.playback_id}/thumbnail.jpg?time=${Math.floor(seg.start_second || 0)}`"
                alt="Video thumbnail" />
        </div>
        <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-description">{{ seg?.context_aware_summary.slice(0, 200) ?? "" }} ...</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useVideoModalStore } from '@/stores/modalStore'

export default defineComponent({
    name: 'VideoSource',
    props: {
        video: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useVideoModalStore()

        const segId = computed(() => props.video?.id as string | undefined)
        const seg = computed(() => (segId.value ? store.segById[segId.value] : undefined))
        const isLoading = computed(() => (segId.value ? !!store.segLoading[segId.value] : false))

        function prefetch() {
            if (segId.value) store.ensureSegment(segId.value)
        }

        function handleClick() {
            if (!segId.value) {
                console.warn('[VideoSource] Missing video.id')
                return
            }
            // Open the shared modal and let it render the same cached segment
            store.openSegmentModal(segId.value)
        }

        function formatDate(d?: Date | string | null) {
            if (!d) return '—'
            const dt = typeof d === 'string' ? new Date(d) : d
            return dt.toLocaleDateString()
        }

        onMounted(() => {
            const id = (props.video as any)?.id
            if (id) {
                // cached + deduped in store
                prefetch()
            }
        })

        return { seg, isLoading, prefetch, handleClick, formatDate }
    },
    methods: {
        handleClick() {
            const modal = useVideoModalStore()
            if (!this.video?.id) {
                console.warn('[VideoSource] Missing video.id')
                return
            }
            modal.openSegmentModal(this.video.id) // open modal for this segment id
        }
    }
})
</script>

<style scoped>
.video-card {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-lg);
    justify-content: space-between;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    cursor: pointer;
}

.video-card:hover {
    background-color: var(--color-surface-hover);
}

.video-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.video-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
}

.video-description {
    color: var(--color-text);
}

.video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
}



.video-thumbnail {
    position: relative;
    width: 200px;
    aspect-ratio: 16/9;
    overflow: hidden;
    border-radius: var(--border-radius-md);
    flex-shrink: 0;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>