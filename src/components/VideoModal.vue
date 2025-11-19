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
                                <VideoSegmentMeta :segment="seg" :title="seg.title || ''" :show-date="true" />
                                <div class="video-player-wrapper">
                                    <mux-player :playback-id="seg.playback_id" :start-time="seg.start_second"
                                        accent-color="var(--color-primary-dark)" />
                                </div>
                                <div class="transcript-section">
                                    <div class="transcript-header">
                                        <h3>Transcript</h3>
                                        <button class="copy-button" @click="handleCopyTranscript">
                                            <ClipboardDocumentIcon class="icon" />
                                            <p>Copier la transcription</p>
                                        </button>
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
                        <transition name="snackbar-fade">
                            <div v-if="snackbarVisible" class="snackbar">
                                {{ snackbarMessage }}
                            </div>
                        </transition>
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
import { ClipboardDocumentIcon } from '@heroicons/vue/24/solid'
import VideoSegmentMeta from './VideoSegmentMeta.vue'
import '@mux/mux-player'

export default defineComponent({
    name: 'VideoModal',
    components: { ClipboardDocumentIcon, VideoSegmentMeta },
    props: {
        visible: { type: Boolean, required: true }
    },
    emits: ['close'],
    data() {
        return {
            snackbarMessage: '',
            snackbarVisible: false,
            snackbarTimeout: null as number | null,
        }
    },
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
        if (this.snackbarTimeout) window.clearTimeout(this.snackbarTimeout)
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
        showSnackbar(message: string, duration = 2000) {
            this.snackbarMessage = message
            this.snackbarVisible = true

            if (this.snackbarTimeout) window.clearTimeout(this.snackbarTimeout)
            this.snackbarTimeout = window.setTimeout(() => {
                this.snackbarVisible = false
                this.snackbarTimeout = null
            }, duration)
        },
        async handleCopyTranscript() {
            const transcript = this.seg?.transcription
            if (!transcript) return

            await navigator.clipboard.writeText(transcript)
            this.showSnackbar('Transcription copiée dans le presse-papiers')
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

.icon {
    width: 16px;
    height: 16px;
    color: var(--color-primary-dark);
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
    margin-top: var(--spacing-md);
    aspect-ratio: 16 / 9;
    padding-bottom: var(--spacing-md);
}

.copy-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary-dark);
}

.copy-button:hover {
    opacity: 0.7;
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
    justify-content: flex-start;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.transcript-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;

}

.transcript-actions {
    display: flex;
    gap: 0px
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

.snackbar {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--color-text);
    color: var(--color-bg, #fff);
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    font-size: 0.875rem;
}

.snackbar-fade-enter-active,
.snackbar-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.snackbar-fade-enter-from,
.snackbar-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
