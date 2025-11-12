
export type EnrichedSegment = {
    id: string,
    title: string | null,
    transcription: string | null,
    context_aware_summary: string | null,
    seance_date: Date | string | null,
    speaker_name: string,
    speaker_image_url: string,
    speaker_url: string,
    political_group: string,
    start_second: number,
    cue_type: string,
    duration: number,
    type: string,
    playback_id: string
}

export function formatSegmentDate(date: Date | string | null): string {
    if (!date) return ''
    if (date instanceof Date) return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Zurich'
    })
    if (typeof date === 'string') return formatSegmentDate(new Date(Date.parse(date)))
}

export function formatSegmentTime(date: Date | string | null, start_second: number = 0): string {
    if (!date) return ''

    const baseDate = date instanceof Date ? new Date(date) : new Date(Date.parse(date))
    const offsetSeconds = Number.isFinite(start_second) ? start_second : 0
    const adjustedDate = new Date(baseDate.getTime() + offsetSeconds * 1000)

    const formatter = new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Zurich'
    })
    const formatted = formatter.format(adjustedDate)
    const [hours, minutes] = formatted.split(':')

    if (!hours || !minutes) return formatted

    return `${hours}h${minutes}min`
}
