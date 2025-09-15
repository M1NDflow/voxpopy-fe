<template>
    <teleport to="main">
        <transition name="backdrop-fade" appear>
            <div v-if="visible" class="video-modal-wrapper" @click.self="handleClickOutside">
                <transition name="modal-fade" appear>
                    <div class="video-modal">
                        <div class="video-modal-header">
                            <div class="nav-left">
                                <button class="nav-link" @click="handleClose">Fermer</button>
                            </div>
                        </div>

                        <div class="video-modal-body">


                            <!-- Content -->
                            <template v-if="seg">
                                <h2 class="video-title">{{ seg.title || 'Segment' }}</h2>

                                <div class="video-player-wrapper">
                                    <mux-player :playback-id="seg.playback_id" :start-time="seg.start_second"
                                        accent-color="var(--color-primary-dark)" />
                                </div>

                                <div class="video-meta">
                                    <Pill :icon="CalendarIcon" tag="Séance"
                                        :description="formatSegmentDate(seg.seance_date)" />
                                    <Pill :icon="ClockIcon" tag="Début de la séance"
                                        :description="formatSegmentTime(seg.seance_date)" />
                                    <Pill v-if="seg.cue_type == 'VOTING' || seg.speaker_name" :icon="UserIcon"
                                        tag="Intervenant"
                                        :description="seg.cue_type === 'VOTING' ? 'Président(e)' : seg.speaker_name || 'Inconnu'" />
                                    <Pill v-if="seg.political_group" :icon="TagIcon" tag="Groupe politique"
                                        :description="seg.political_group || 'Inconnu'" />
                                </div>

                                <div class="transcript-section">
                                    <div class="transcript-header">
                                        <h3>Transcript</h3>
                                    </div>
                                    <p class="transcript-text">
                                        {{ seg.transcription || '—' }}
                                    </p>
                                </div>
                            </template>
                            <!-- Error / Empty
                            <template v-else-if="hasError">
                                <p class="text-sm text-red-600">Impossible de charger ce segment.</p>
                            </template> -->
                            <!-- Loading state -->
                            <template v-else>
                                <div class="h-6 bg-gray-200 animate-pulse rounded mb-3" />
                                <div class="h-4 bg-gray-200 animate-pulse rounded mb-3" />
                                <div class="h-48 bg-gray-200 animate-pulse rounded mb-6" />
                            </template>

                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVideoModalStore } from '@/stores/modalStore'
import type { EnrichedSegment } from '@/types/enriched_segments'
import { CalendarIcon, UserIcon, TagIcon, ClockIcon } from '@heroicons/vue/24/solid'
import Pill from './Pill.vue'
import { formatSegmentDate, formatSegmentTime } from '@/types/enriched_segments'
import '@mux/mux-player'

export default defineComponent({
    name: 'VideoModal',
    components: { Pill, CalendarIcon, UserIcon, TagIcon, ClockIcon },
    props: {
        visible: { type: Boolean, required: true }
    },
    emits: ['close'],
    computed: {
        videoModalStore(): ReturnType<typeof useVideoModalStore> {
            return useVideoModalStore()
        },
        segmentId(): string | null {
            return this.videoModalStore.modal?.id ?? null
        },
        seg(): EnrichedSegment | undefined {
            return this.segmentId ? this.videoModalStore.segById[this.segmentId] : undefined
        },
        isLoading(): boolean {
            return !!(this.segmentId && this.videoModalStore.segLoading[this.segmentId])
        },
        hasError(): boolean {
            return !!(this.videoModalStore.segError[this.segmentId] ?? false)
        }
    },
    setup() {
        return { CalendarIcon, UserIcon, TagIcon, ClockIcon, formatSegmentDate, formatSegmentTime }
    },
    watch: {
        visible: {
            immediate: true,
            handler(vis: boolean) {
                if (vis && this.segmentId) this.videoModalStore.ensureSegment(this.segmentId)
            },
        },
        segmentId(newId: string | null) {
            if (this.visible && newId) this.videoModalStore.ensureSegment(newId)
        },
    },
    mounted() {
        window.addEventListener('keydown', this.handleEscape as any)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEscape as any)
    },
    methods: {
        handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') this.handleClose()
        },
        handleClickOutside() {
            this.handleClose()
        },
        handleClose() {
            // close via store (clears modal.id) and notify parent
            this.videoModalStore.closeModal()
            this.$emit('close')
        },
    },
})
</script>


<style scoped>
.video-modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}

.video-modal {
    max-width: 60%;
    height: 100%;
    background-color: var(--color-bg, #fff);
    box-shadow: -2px 0 30px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-lg);
    overflow-y: auto;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.video-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.nav-link {
    background: none;
    border: none;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 8px 0px;
}

.video-title {
    font-size: 1.25rem;
    font-weight: bold;
    padding-bottom: var(--spacing-md);
}

.video-player-wrapper {
    width: 100%;
    aspect-ratio: 16 / 9;
    padding-bottom: var(--spacing-md);
}

.video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xl);
}

.transcript-section {
    padding-bottom: 64px;
}

.transcript-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.transcript-header h3 {
    margin: 0;
    font-size: 1rem;
}

.transcript-actions {
    display: flex;
    gap: var(--spacing-xs);
}

.small-button {
    font-size: 0.75rem;
    padding: 4px 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    cursor: pointer;
}

.mux-player {
    width: 100%;
    aspect-ratio: 16 / 9;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

/* Fade in the dark backdrop */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
    transition: opacity 0.2s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
    opacity: 0;
}
</style>