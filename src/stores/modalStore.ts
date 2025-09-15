// stores/videoModal.ts
import { defineStore } from 'pinia'
import { reactive, shallowRef } from 'vue'
import type { EnrichedSegment } from '@/types/enriched_segments'
import { fetchSegmentById } from '@/db/db'

type ModalState = { id: string } | null

export const useVideoModalStore = defineStore('video-modal', () => {
    // which modal is open
    const modal = shallowRef<ModalState>(null)

    // segment cache + status
    const segById: Record<string, EnrichedSegment | undefined> = reactive({})
    const segLoading: Record<string, boolean> = reactive({})
    const segError: Record<string, unknown> = reactive({})
    const segControllers: Record<string, AbortController | undefined> = reactive({})

    async function fetchSegment(id: string): Promise<EnrichedSegment> {
        // cancel any in-flight fetch for this id
        segError[id] = null
        segLoading[id] = true
        segControllers[id]?.abort()
        const ac = new AbortController()
        segControllers[id] = ac

        try {
            const seg = await fetchSegmentById(id, { signal: ac.signal })
            segById[id] = seg
            return seg
        } catch (e: any) {
            if (e?.name !== 'AbortError') segError[id] = e
            throw e
        } finally {
            segLoading[id] = false
            segControllers[id] = undefined
        }
    }

    function ensureSegment(id: string) {
        return segById[id] ? Promise.resolve(segById[id] as EnrichedSegment) : fetchSegment(id)
    }

    function openSegmentModal(id: string) {
        modal.value = { id }
        void ensureSegment(id) // prefetch without blocking UI
    }

    function closeModal() {
        if (modal.value?.id) segControllers[modal.value.id]?.abort()
        modal.value = null
    }

    return {
        // modal state
        modal, openSegmentModal, closeModal,
        // data cache & loaders
        segById, segLoading, segError, ensureSegment, fetchSegment,
    }
}, {
    persist: true
})