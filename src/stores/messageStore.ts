import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiResponse } from '@/types/api'
import type { Message } from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  // === State ===
  const messages = ref<Message[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // === Getters ===
  const lastMessage = computed<Message | null>(() => messages.value.at(-1) || null)
  const getIsLoading = computed<boolean>(() => isLoading.value)

  function getMessageById(id: number): Message | null {
    return messages.value.find(m => m.id === id) || null
  }

  // Check if a specific message is loading
  function isMessageLoading(id: number): boolean {
    return getMessageById(id)?.isLoading || false
  }

  function updateMessageById(id: number, update: Partial<Message>) {
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
    const messageId = Date.now()
    isLoading.value = true

    const message: Message = {
      id: messageId,
      text: text,
      isLoading: true,
      timestamp: new Date()
    }
    messages.value.push(message)

    let sid = localStorage.getItem('vp_session_id');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('vp_session_id', sid); }

    try {
      const response = await fetch('https://automations.m1ndflow.com/webhook/via-democratia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          session_id: sid
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const json = await response.json();
      const responseData: ApiResponse = json[0].output;

      updateMessageById(messageId, {
        responseData: responseData,
        isLoading: false
      });
    }
    catch (err) {
      error.value = 'Failed to send message'
      console.error(err)

      if (messageId !== -1) {
        const message = getMessageById(messageId)
        if (message) {
          updateMessageById(messageId, {
            responseData: {
              response: 'Failed to get response',
              documents: [],
              videos: []
            },
          });
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  // Clear all messages and reset state
  function $reset() {
    messages.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // state
    messages,
    isLoading,
    error,

    // getters
    lastMessage,
    getIsLoading,
    isMessageLoading,
    getMessageById,
    // actions
    sendMessage,
    $reset
  }
}, {
  persist: true
})