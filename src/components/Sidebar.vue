<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>
          <span class="title">
            democrat
            <span class="bold">IA</span>
          </span>
          <span class="alpha-tag">Beta</span>
        </h2>
        <ResetButton />
      </div>

      <section class="history-section">
        <h3>Historique</h3>
        <HistoryList v-if="historyItems.length" :items="historyItems" :active-id="activeSessionId"
          @select="handleHistorySelect" />
        <p v-else class="history-empty">Aucune conversation enregistrée pour le moment.</p>
      </section>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import ResetButton from './ResetButton.vue'
import HistoryList from './HistoryList.vue'
import { useHistoryStore } from '@/stores/historyStore'
import { useMessageStore } from '@/stores/messageStore'

export default {
  name: 'Sidebar',
  components: {
    ResetButton,
    HistoryList
  },
  emits: ['historySelect'],
  setup() {
    const historyStore = useHistoryStore()
    const messageStore = useMessageStore()
    const historyItems = computed(() =>
      historyStore.history.map(entry => ({
        id: entry.session_id,
        session_id: entry.session_id,
        title: entry.title || 'Conversation'
      }))
    )
    return {
      historyStore,
      historyItems,
      activeSessionId: computed(() => messageStore.sessionId)
    }
  },
  methods: {
    handleHistorySelect(item) {
      this.$emit('historySelect', item)
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 260px;
  padding: var(--spacing-xl) var(--spacing-lg);
  border-right: 1px solid var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
  position: relative;
}

.history-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.history-empty {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

h2 {
  font-size: var(--font-size-lg);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.alpha-tag {
  font-size: var(--font-size-xxs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text);
}

h3 {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-small);
  color: var(--color-text-secondary);
  letter-spacing: 0.08em;
  margin: 0;
}

.bold {
  font-weight: var(--font-weight-bold);
}

.title {
  display: flex;
}
</style>
