<template>
  <header class="navbar">
    <div class="navbar-content">
      <a href="#" class="brand">ViaDemocratia</a>
      <ResetButton />
    </div>
  </header>

</template>

<script setup>
import ResetButton from './ResetButton.vue'
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  background-color: var(--color-surface);
  z-index: 1000;
  padding: 0 var(--spacing-xl);
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-header);
  border-bottom: 1px solid var(--color-border);
}

.navbar-content {
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
}

.brand {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}
</style>
