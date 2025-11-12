import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '@/types/message'
import type { ApiResponse, Document, Segment } from '@/types/api'
import { streamSSE } from '../utils/stream'

export type HistoryMessageRecord = {
  id: string
  input: string | null
  response: string | null
  documents: Document[] | null
  segments: Segment[] | null
  creation_date: string | null
}

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isResetting = ref(false)
  const listVersion = ref(0)
  const highReasoningEffort = ref<boolean>(false)
  const sessionId = ref<string | null>(null)

  function getMessageById(id: string): Message | null {
    return messages.value.find(m => m.id === id) || null
  }

  function isMessageLoading(id: string): boolean {
    return getMessageById(id)?.isLoading || false
  }

  function updateMessageById(id: string, update: Partial<Message>) {
    const index = messages.value.findIndex(m => m.id === id);
    if (index !== -1) {
      messages.value[index] = {
        ...messages.value[index],
        ...update
      };
    }
  }

  function setSession(id: string) {
    sessionId.value = id
  }

  async function sendMessage(text: string, providedSessionId?: string): Promise<void> {
    const messageId = crypto.randomUUID()
    isLoading.value = true
    if (providedSessionId) {
      setSession(providedSessionId)
    }
    if (!sessionId.value) {
      throw new Error('[messageStore] sessionId is required before sending messages.')
    }

    const message: Message = {
      id: messageId,
      text: text,
      corrected_text: text,
      isLoading: true,
      is_high_reasoning_effort: highReasoningEffort.value,
      timestamp: new Date()
    }
    messages.value.push(message)

    const sid = sessionId.value

    const index = messages.value.findIndex(m => m.id === messageId);

    try {
      await streamSSE('/api/get-response', {
        previous_messages: messages.value.length == 2 ? messages.value.slice(index - 1, index).map(m => m.corrected_text) : messages.value.slice(index - 2, index).map(m => m.corrected_text),
        input: text,
        session_id: sid,
        is_reasoning_query: highReasoningEffort.value,
      }, (payload, done) => {

        if (payload == null) {
          updateMessageById(messageId, { isLoading: false });
          return;
        }

        // ignore empty/keepalive/comment frames
        if (typeof payload !== 'string' || !payload.trim() || payload.trim().startsWith(':')) {
          return;
        }
        // parse safely
        try {
          const parsed = JSON.parse(payload);           // may throw on non-JSON
          updateMessageById(messageId, {
            corrected_text: parsed.input,
            responseData: parsed,
            isLoading: !done
          });
        } catch {
        }
      });
    }
    catch (err) {
      error.value = 'Failed to send message'
      console.error(err)

      if (messageId) {
        const message = getMessageById(messageId)
        if (message) {
          updateMessageById(messageId, {
            responseData: {
              response: 'Failed to get response',
              documents: [],
              segments: []
            },
            isLoading: false
          });
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  function $reset() {
    messages.value = []
    isLoading.value = false
    error.value = null
  }

  async function resetChat() {
    isResetting.value = true
    try {
      $reset()
      sessionId.value = null
      listVersion.value++
    } finally {
      isResetting.value = false
    }
  }

  function hydrateFromHistory(
    session: string,
    rows: HistoryMessageRecord[]
  ) {
    sessionId.value = session
    messages.value = rows.map(row => {
      const docs = row.documents ?? []
      const segs = row.segments ?? []
      const responseText = row.response ?? ''

      const responseData: ApiResponse | undefined =
        responseText || docs.length || segs.length
          ? {
            response: responseText,
            documents: docs,
            segments: segs
          }
          : undefined

      return {
        id: row.id ?? crypto.randomUUID(),
        text: row.input ?? '',
        corrected_text: row.input ?? '',
        isLoading: false,
        timestamp: row.creation_date ? new Date(row.creation_date) : new Date(),
        responseData
      }
    })

    listVersion.value++
    isLoading.value = false
    error.value = null
  }


  return {
    // state
    messages,
    isLoading,
    error,
    isResetting,
    listVersion,
    highReasoningEffort,
    sessionId,
    isMessageLoading,
    getMessageById,
    setSession,
    // actions
    sendMessage,
    resetChat,
    hydrateFromHistory
  }
}, {
  persist: true
})
