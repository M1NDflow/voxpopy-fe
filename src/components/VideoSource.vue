<template>
    <div class="video-source">
        <div class="video-title-speaker">
            <h3>
                <template v-if="seg?.speaker_url">
                    <a :href="seg.speaker_url" class="speaker-link" target="_blank" rel="noopener noreferrer">
                        {{ seg?.cue_type === 'VOTING' ? 'Président(e)' : seg?.speaker_name || 'Inconnu' }}
                    </a>
                </template>
                <template v-else>
                    {{ seg?.cue_type === 'VOTING' ? 'Président(e)' : seg?.speaker_name || 'Inconnu' }}
                </template>
                ·
            </h3>
            <h3 class="video-title-datetime">{{ formatSegmentTime(seg?.seance_date, seg?.start_second) }} · </h3>
            <h3 class="video-title-political-group">( {{ seg?.political_group || 'Inconnu' }} )</h3>
        </div>
        <div class="video-title">
            <h3 class="video-title-seance">{{ video.title }} · </h3>
        </div>
        <div class="video-card" @click="handleClick">
            <div class="video-info">
                <div v-if="!!(seg?.speaker_image_url)" class="video-thumbnail">
                    <img :src="seg?.speaker_image_url" alt="Video thumbnail" />
                </div>
                <div v-else-if="!!(seg?.playback_id)" class="video-thumbnail">
                    <img :src="`https://image.mux.com/${seg.playback_id}/thumbnail.jpg?time=${Math.floor(seg.start_second + 15 || 0)}`"
                        alt="Video thumbnail" />
                </div>
                <p class="video-description">{{ (seg?.context_aware_summary ?? "").slice(0, 400) }} ...</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useVideoModalStore } from '@/stores/modalStore'
import Pill from './Pill.vue'
import { CalendarIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/vue/24/solid'
import { formatSegmentTime, formatSegmentDate } from '@/types/enriched_segments'

export default defineComponent({
    name: 'VideoSource',
    components: { Pill, CalendarIcon, ClockIcon, UserIcon, TagIcon },
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

        return { seg, isLoading, prefetch, handleClick, formatDate, CalendarIcon, ClockIcon, UserIcon, TagIcon, formatSegmentTime, formatSegmentDate }
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
    flex-direction: column;
    gap: var(--spacing-xs);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    padding: var(--spacing-md);
}

.video-source {
    display: flex;
    flex-direction: column;
}

.video-meta {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) 0px;
}

.video-card:hover {
    background-color: var(--color-surface-hover);
}

.video-info {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xs);
}

.video-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
}

.video-description {
    color: var(--color-text-subtitle1);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-light);
}

.video-thumbnail {
    position: relative;
    width: 120px;
    max-height: 120px;
    aspect-ratio: 1/1;
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

.video-title-datetime {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-subtitle1);
    vertical-align: middle;
}

.video-title-speaker {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary-dark);
    vertical-align: middle;
}

.speaker-link {
    color: inherit;
    text-decoration: none;
}

.speaker-link:hover,
.speaker-link:focus-visible {
    text-decoration: underline;
}

.video-title-political-group {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-subtitle1);
    vertical-align: middle;
}
</style>
