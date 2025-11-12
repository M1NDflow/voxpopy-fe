<template>
  <div class="messages-container" ref="messagesContainer">
    <Message v-for="message in messages" :key="message.id" :message-id="message.id" />
    <div ref="bottomSentinel" class="scroll-sentinel" aria-hidden="true"></div>
    <div v-if="!isAtBottom" class="bottom-indicator" @click="scrollToBottomSmooth">
      <ArrowDownIcon class="arrow-down" />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useMessageStore } from '@/stores/messageStore';
import Message from './Message.vue';
import { ArrowDownIcon } from '@heroicons/vue/24/outline';

export default defineComponent({
  name: 'MessagesList',
  components: { Message, ArrowDownIcon },
  setup() {
    const messageStore = useMessageStore();
    const messagesContainer = ref<HTMLElement | null>(null);
    const scrollContainer = ref<HTMLElement | null>(null);
    const bottomSentinel = ref<HTMLElement | null>(null);

    const isAtBottom = ref(true);
    const shouldAutoScroll = ref(true);
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const checkIfAtBottomMath = () => {
      const el = scrollContainer.value ?? messagesContainer.value;
      if (!el) return true;
      const nearBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 10;
      isAtBottom.value = nearBottom;
      return nearBottom;
    };

    const handleScroll = () => {
      if (!scrollContainer.value && !messagesContainer.value) return;
      const atBottom = checkIfAtBottomMath();
      shouldAutoScroll.value = atBottom;
    };

    const smoothScrollOptions: ScrollIntoViewOptions = { behavior: 'smooth', block: 'end', inline: 'nearest' };
    const instantScrollOptions: ScrollIntoViewOptions = { behavior: 'auto', block: 'end', inline: 'nearest' };

    const scrollToBottom = (opts: ScrollIntoViewOptions = smoothScrollOptions) => {
      bottomSentinel.value?.scrollIntoView(opts); // spec-compliant, widely supported.  [oai_citation:2‡MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView?utm_source=chatgpt.com)
    };

    const scrollToBottomSmooth = () => scrollToBottom(smoothScrollOptions);

    const findScrollParent = (el: HTMLElement | null) => {
      if (!el || typeof window === 'undefined') return null;
      let parent = el.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY.includes('auto') || overflowY.includes('scroll')) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return (document.scrollingElement ?? null) as HTMLElement | null;
    };

    // Keep at-bottom state via IntersectionObserver (root = scroll container)
    onMounted(() => {
      const contentEl = messagesContainer.value;
      scrollContainer.value = findScrollParent(contentEl) ?? contentEl;

      const target = bottomSentinel.value;
      if (target) {
        const observerOptions: IntersectionObserverInit = { threshold: 0.99 };
        if (scrollContainer.value) observerOptions.root = scrollContainer.value;
        io = new IntersectionObserver(
          ([entry]) => { isAtBottom.value = entry.isIntersecting; },
          observerOptions // consider "at bottom" when sentinel is ~fully visible
        );
        io.observe(target);
      }

      scrollContainer.value?.addEventListener('scroll', handleScroll, { passive: true });

      // Optional: react to container growth (new tokens) and keep user pinned if already at bottom
      if ('ResizeObserver' in window && contentEl) {
        ro = new ResizeObserver(() => {
          if (isAtBottom.value) scrollToBottom(instantScrollOptions);
        });
        ro.observe(contentEl); // container size/content changes.  [oai_citation:3‡MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver?utm_source=chatgpt.com)
      }

      handleScroll();
    });

    onBeforeUnmount(() => {
      io?.disconnect();
      ro?.disconnect();
      scrollContainer.value?.removeEventListener('scroll', handleScroll);
    });

    // When messages change, if user is at bottom, stay pinned
    watch(
      () => messageStore.messages.length,
      () => {
        shouldAutoScroll.value = true;
        nextTick(() => {
          if (shouldAutoScroll.value) scrollToBottomSmooth();
        });
      },
      { immediate: true }
    );

    watch(
      () => messageStore.messages[messageStore.messages.length - 1],
      () => {
        if (!shouldAutoScroll.value) return;
        nextTick(() => scrollToBottom(instantScrollOptions));
      },
      { deep: true }
    );

    return {
      messageStore,
      messagesContainer,
      scrollContainer,
      bottomSentinel,
      isAtBottom,
      shouldAutoScroll,
      ArrowDownIcon,
      handleScroll,
      scrollToBottom,
      scrollToBottomSmooth,
    };
  },
  computed: {
    messages() { return this.messageStore.messages; },
    isLoading() { return this.messageStore.isLoading; }
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
  padding-top: calc(var(--spacing-xl) + var(--spacing-md));
}

.scroll-sentinel {
  width: 100%;
  height: 1px;
}

.arrow-down {
  height: 10px;
  width: 15px;
  color: white;
}

.bottom-indicator {
  height: 20px;
  width: 20px;
  box-shadow: var(--shadow-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-icon-bg);
  border-radius: 50%;
  position: fixed;
  bottom: 170px;
  right: calc(50vw - 260px /2);
  cursor: pointer;
  padding: 4px;
}
</style>
