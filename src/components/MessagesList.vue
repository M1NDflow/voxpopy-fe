<template>
  <div class="messages-container" ref="messagesContainer">
    <Message v-for="message in messages" :key="message.id" :message-id="message.id" />
  </div>
</template>

<script lang=“ts”>
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore';
import { nextTick } from 'vue';
import Message from './Message.vue';

export default defineComponent({
  name: 'MessagesList',
  components: {
    Message
  },
  setup() {
    const messageStore = useMessageStore();
    return { messageStore };
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    handleScroll() {
      nextTick(() => {
        this.scrollToBottom();
      });
    },
  },
  computed: {
    messages() {
      return this.messageStore.messages;
    },
    isLoading() {
      return this.messageStore.isLoading;
    }
  },
  watch: {
    messages: {
      handler() {
        this.handleScroll();
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    this.handleScroll();
  }
});
</script>

<style scoped>
.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-xl);
}
</style>
