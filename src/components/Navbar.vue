<template>
  <header class="navbar">
    <div class="navbar-content">
      <svg width="200" height="100" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg"
        aria-label="ViaDemocratia logo concept C">
        <g transform="translate(120,180)">
          <path d="M0,0 L80,0 L140,120 L200,0 L280,0 L140,240 Z" fill="#111111" />
          <rect x="40" y="100" width="180" height="18" rx="9" fill="#F0B400" />
          <rect x="72" y="118" width="12" height="16" fill="#F0B400" />
          <rect x="92" y="118" width="12" height="10" fill="#F0B400" />
          <circle cx="230" cy="109" r="22" fill="#F0B400" />
          <circle cx="230" cy="109" r="10" fill="white" />
        </g>

        <g transform="translate(450,300) scale(1.5)">
          <text x="0" y="0"
            font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            font-size="56" font-weight="700" fill="#1A1A1A">ViaDemocratia</text>
          <text x="0" y="48"
            font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            font-size="20" fill="#4A4A4A">Conseil municipal de Genève</text>
        </g>
      </svg>

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
}

.brand {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}
</style>
