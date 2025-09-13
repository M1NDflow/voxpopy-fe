<template>
    <button class="reset-button" @click="handleReset" :disabled="isResetting">
        <div class="reset-button-icon">
            <PencilSquareIcon v-if="!isResetting" />
            <span v-else class="loading-spinner"></span>
        </div>
        <p>{{ isResetting ? 'Resetting...' : 'New Chat' }}</p>
    </button>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { PencilSquareIcon } from '@heroicons/vue/24/solid'

const messageStore = useMessageStore()
const isResetting = ref(false)

const handleReset = async () => {
    if (confirm('Are you sure you want to start a new chat? This will clear all message history.')) {
        isResetting.value = true
        try {
            await messageStore.resetChat()
            await nextTick()
        } finally {
            isResetting.value = false
        }
    }
}
</script>

<style scoped>
.reset-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 16px;
    background-color: var(--color-primary-dark);
    color: white;
    border: none;
    border-radius: var(--border-radius-lg);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
    height: 40px;
    opacity: 0.9;
}

.reset-button:hover:not(:disabled) {
    opacity: 1;
    transform: translateY(-1px);
}

.reset-button:active:not(:disabled) {
    transform: translateY(0);
}

.reset-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.reset-button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.reset-button svg {
    width: 100%;
    height: 100%;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
