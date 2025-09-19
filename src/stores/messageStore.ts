import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '@/types/message'
import { streamSSE } from '../utils/stream'

export const useMessageStore = defineStore('message', () => {
  // === State ===
  const messages = ref<Message[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const isResetting = ref(false)
  const listVersion = ref(0)
  const highReasoningEffort = ref<boolean>(false)

  function getMessageById(id: string): Message | null {
    return messages.value.find(m => m.id === id) || null
  }

  // Check if a specific message is loading
  function isMessageLoading(id: string): boolean {
    return getMessageById(id)?.isLoading || false
  }

  function updateMessageById(id: string, update: Partial<Message>) {
    const index = messages.value.findIndex(m => m.id === id);
    if (index !== -1) {
      messages.value[index] = {
        ...messages.value[index],
        ...update
      };
    }
  }

  // === Actions ===
  async function sendMessage(text: string): Promise<void> {
    const messageId = crypto.randomUUID()
    isLoading.value = true

    const message: Message = {
      id: messageId,
      text: text,
      corrected_text: text,
      isLoading: true,
      is_high_reasoning_effort: highReasoningEffort.value,
      timestamp: new Date()
    }
    messages.value.push(message)

    let sid = localStorage.getItem('vp_session_id');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('vp_session_id', sid); }

    const index = messages.value.findIndex(m => m.id === messageId);

    try {
      await streamSSE('https://voxpopy-agent.onrender.com/get-response', {
        previous_messages: messages.value.length == 2 ? messages.value.slice(index - 1, index).map(m => m.corrected_text) : messages.value.slice(index - 2, index).map(m => m.corrected_text),
        input: text,
        session_id: sid,
        is_reasoning_query: highReasoningEffort.value
      }, (payload, done) => {
        if (payload == null) {
          updateMessageById(messageId, { isLoading: false });
          return;
        }
        updateMessageById(messageId, { corrected_text: JSON.parse(payload).input, responseData: JSON.parse(payload), isLoading: !done });
      });
    }
    catch (err) {
      error.value = 'Failed to send message'
      console.error(err)

      if (messageId) {
        const message = getMessageById(messageId)
        if (message) {
          updateMessageById(messageId, {
            responseData: {
              response: 'Failed to get response',
              documents: [],
              segments: []
            },
            isLoading: false
          });
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  // Clear all messages and reset state
  function $reset() {
    // Create a new array reference to ensure reactivity
    messages.value = []
    isLoading.value = false
    error.value = null
  }

  async function resetChat() {
    isResetting.value = true
    try {
      localStorage.removeItem('vp_session_id') // clear cache first
      $reset()                                   // then clear store
      listVersion.value++                        // force remount of list
    } finally {
      isResetting.value = false
    }
  }


  return {
    // state
    messages,
    isLoading,
    error,
    isResetting,
    listVersion,
    highReasoningEffort,
    isMessageLoading,
    getMessageById,
    // actions
    sendMessage,
    resetChat
  }
}, {
  persist: true
})