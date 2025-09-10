<template>
    <button class="reset-button" @click="handleReset">
        <div class="reset-button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
            </svg>
        </div>
        <p>New Chat</p>
    </button>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/messageStore'

const messageStore = useMessageStore()

const handleReset = async () => {
    if (confirm('Are you sure you want to start a new chat? This will clear all message history.')) {
        messageStore.$reset()
        localStorage.removeItem('vp_session_id')
    }
}
</script>

<style scoped>
.reset-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: var(--color-primary-dark);
    color: white;
    border: none;
    border-radius: var(--border-radius-lg);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    height: 40px;
}

.reset-button:hover:not(:disabled) {
    opacity: 0.9;
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
}

.reset-button svg {
    width: 16px;
    height: 16px;
}
</style>
