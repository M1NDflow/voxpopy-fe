import { useMessageStore } from '@/stores/messageStore'
import { useHistoryStore } from '@/stores/historyStore'

const DEFAULT_HISTORY_TITLE = 'Nouvelle conversation'

export function useConversationSession() {
  const messageStore = useMessageStore()
  const historyStore = useHistoryStore()

  function ensureSession(title?: string): string {
    if (!messageStore.sessionId || messageStore.messages.length === 0) {
      const sessionId = crypto.randomUUID()
      messageStore.setSession(sessionId)
      historyStore.upsertHistory({
        session_id: sessionId,
        title: title?.trim() || DEFAULT_HISTORY_TITLE
      })
      return sessionId
    }
    return messageStore.sessionId
  }

  return {
    ensureSession
  }
}
