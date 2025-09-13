
export type EnrichedSegment = {
    id: string
    title: string | null
    transcription: string | null
    context_aware_summary: string | null
    seance_date: Date
    speaker_name: string
    political_group: string
    start_second: number
    duration: number
    type: string
    playback_id: string
}
