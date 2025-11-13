import { defineStore } from 'pinia'
import { ref } from 'vue'

export type HistoryMetadata = {
  session_id: string
  title: string
}

export const useHistoryStore = defineStore('conversation-history', () => {
  const history = ref<HistoryMetadata[]>([])

  function upsertHistory(entry: HistoryMetadata) {
    const index = history.value.findIndex(c => c.session_id === entry.session_id)
    if (index === -1) {
      history.value.unshift(entry)
    } else {
      history.value[index] = { ...history.value[index], ...entry }
    }
  }

  function setHistory(items: HistoryMetadata[]) {
    history.value = [...items]
  }

  function getHistoryEntry(sessionId: string) {
    return history.value.find(c => c.session_id === sessionId) ?? null
  }

  function clearHistory() {
    history.value = []
  }

  return {
    history,
    upsertHistory,
    setHistory,
    getHistoryEntry,
    clearHistory
  }
}, {
  persist: true
})
