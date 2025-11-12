<template>
  <div class="history-list">
    <HistoryTab v-for="item in items" :key="item.id || item.title" :title="item.title"
      :disabled="item.session_id === activeId" :is-active="item.session_id === activeId"
      @select="$emit('select', item)" />
  </div>
</template>

<script>
import HistoryTab from './HistoryTab.vue'

export default {
  name: 'HistoryList',
  components: {
    HistoryTab
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    activeId: {
      type: String,
      default: null
    }
  },
  emits: ['select']
}
</script>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
