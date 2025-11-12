import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_API_KEY)

export async function fetchSegmentById(
    segmentId,
    opts
) {
    const { data, error } = await supabase
        .from('segment')
        .select(`
      id, title, transcription, context_aware_summary,
      start_seconds, duration, cue_type,
      seance:seance_id ( playback_id, datetime ),
      speaker:speaker (
        full_name,
        political_party,
        image_url,
        url,
        party_row:political_party ( party )
      )
    `, { count: 'exact' })
        .eq('id', segmentId)
        .single()
        .abortSignal(opts?.signal)

    if (error || !data) throw new Error(error?.message ?? 'Segment not found')

    return {
        id: data.id,
        title: data.title,
        transcription: data.transcription,
        context_aware_summary: data.context_aware_summary,
        seance_date: data.seance?.datetime ? new Date(data.seance.datetime) : null,
        speaker_name: data.speaker?.full_name ?? '',
        speaker_image_url: data.speaker?.image_url ?? '',
        speaker_url: data.speaker?.url ?? '',
        political_group: data.speaker?.party_row?.party ?? '',
        cue_type: data.cue_type ?? '',
        start_second: data.start_seconds ?? 0,
        duration: data.duration ?? 0,
        type: data.cue_type ?? '',
        playback_id: data.seance?.playback_id ?? null,
    }

}

export async function fetchConversationMessages(sessionId) {
    const { data, error } = await supabase
        .from('ai_chat_memory')
        .select('id, session_id, input, response, creation_date, documents, segments')
        .eq('session_id', sessionId)
        .order('creation_date', { ascending: true })

    if (error) throw new Error(error.message ?? 'Unable to load conversation history')
    return data ?? []
}
