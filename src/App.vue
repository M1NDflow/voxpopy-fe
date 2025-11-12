<script setup lang="ts">
import { ref } from 'vue'
import MainContent from './components/MainContent.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
import { fetchConversationMessages } from '@/db/db'
import { useMessageStore, type HistoryMessageRecord } from '@/stores/messageStore'

const messageStore = useMessageStore()
const historyError = ref<string | null>(null)
const isLoadingHistory = ref(false)

async function handleHistorySelect(item: { session_id: string }) {
  if (!item?.session_id) return
  historyError.value = null
  isLoadingHistory.value = true

  try {
    const rows = await fetchConversationMessages(item.session_id) as HistoryMessageRecord[]
    messageStore.hydrateFromHistory(item.session_id, rows)
  } catch (err: any) {
    console.error('[App] Failed to load history', err)
    historyError.value = err?.message ?? 'Impossible de charger cette conversation'
  } finally {
    isLoadingHistory.value = false
  }
}
</script>

<template>
  <div class="app-shell">
    <Sidebar @historySelect="handleHistorySelect" />
    <div class="main-column">
      <div v-if="isLoadingHistory" class="history-loading">Chargement de la conversation…</div>
      <p v-if="historyError" class="history-error">{{ historyError }}</p>
      <MainContent />
      <Footer />
    </div>
  </div>
</template>

<style>
/* Base layout reset kept lean; detailed styles live in components */
html,
body,
#app {
  height: 100%;
  max-height: 100vh;
}

.app-shell {
  display: flex;
  max-height: 100vh;
}

.main-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: 100%;
  padding-bottom: var(--spacing-md);
  box-sizing: border-box;
}

.history-error {
  margin: var(--spacing-sm) var(--spacing-md) 0;
  padding: var(--spacing-xs) var(--spacing-md);
  color: #b42318;
  background: #fee4e2;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
}

.history-loading {
  margin: var(--spacing-sm) var(--spacing-md) 0;
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}
</style>
