<template>
    <main class="main-wrapper" ref="messagesContainer" :class="{ 'has-responses': messageStore.messages.length > 0 }">

        <template v-if="!messageStore.isResetting">
            <WelcomeMessage v-if="messageStore.messages.length === 0" />
            <MessagesList v-else @new-message="scrollToTop" :key="messageStore.listVersion" />
        </template>
    </main>
</template>

<script>
import { useMessageStore } from '@/stores/messageStore';
import WelcomeMessage from './WelcomeMessage.vue';
import MessagesList from './MessagesList.vue';

export default {
    name: 'MainContent',
    components: {
        WelcomeMessage,
        MessagesList
    },
    setup() {
        const messageStore = useMessageStore();
        return {
            messageStore,
        };
    },
    methods: {
        scrollToTop() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                if (container) {
                    // Get the last message element
                    const lastMessage = container.querySelector('.message:last-child');
                    if (lastMessage) {
                        // Scroll the message into view with smooth behavior
                        lastMessage.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }
    },
    watch: {
        'messageStore.messages': {
            handler() {
                this.scrollToTop();
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.main-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    overflow-y: auto;
}

.main-wrapper:not(.has-responses) {
    justify-content: center;
}
</style>
