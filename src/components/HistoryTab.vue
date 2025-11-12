<template>
  <button class="history-tab" type="button" :class="{ 'history-tab--active': isActive }" :disabled="disabled"
    @click="handleClick">
    <span>{{ title }}</span>
  </button>
</template>

<script>
export default {
  name: 'HistoryTab',
  props: {
    title: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  methods: {
    handleClick() {
      if (this.disabled) return
      this.$emit('select')
    }
  }
}
</script>

<style scoped>
.history-tab {
  width: 100%;
  text-align: left;
  border: none;
  border-radius: var(--border-radius-sm);
  background: var(--color-surface);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-subtitle1);
  font-weight: var(--font-weight-light);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast);
  display: flex;
  align-items: center;
}

.history-tab:hover:not(:disabled),
.history-tab:focus-visible:not(:disabled) {
  background: #f4f4f4;
  outline: none;
}

.history-tab--active {
  background: var(--color-primary);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.history-tab:disabled {
  cursor: default;
  opacity: 0.8;
}

.history-tab span {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
