<template>
    <div class="container input-wrapper">
        <div class="question-input-wrapper">
            <div class="question-input-container">
                <textarea ref="textAreaRef" v-model="inputValue" class="question-input" :placeholder="placeholder"
                    :rows="1" @input="adjustHeight" @keydown.enter.exact.prevent="handleSubmit"
                    @keydown.enter.shift.exact.prevent="addNewline"></textarea>
            </div>
            <button class="send-button" @click="handleSubmit" :disabled="!isSendEnabled" :aria-label="buttonLabel">
                <div>
                    <PaperAirplaneIcon class="send-icon" />
                </div>
            </button>
        </div>
        <p class="disclaimer">
            {{ $t('disclaimer') }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore';
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import { useConversationSession } from '@/composables/useConversationSession'

export default defineComponent({
    name: 'QuestionInput',
    components: {
        PaperAirplaneIcon
    },
    data() {
        return {
            inputValue: '',
            messageStore: useMessageStore(),
            conversationSession: useConversationSession(),
            baseScrollHeight: 0
        };
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Posez votre question ici...'
        },
        buttonLabel: {
            type: String,
            default: 'Envoyer le message'
        },
        maxRows: {
            type: Number,
            default: 4
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.textAreaRef) {
                this.baseScrollHeight = this.$refs.textAreaRef.scrollHeight;
                this.adjustHeight();
            }
        });
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(newVal) {
                if (newVal !== this.inputValue) {
                    this.inputValue = newVal;
                    this.$nextTick(() => this.adjustHeight());
                }
            }
        },
        inputValue(newVal) {
            this.$emit('update:modelValue', newVal);
        }
    },
    computed: {
        isSendEnabled() {
            return this.inputValue.trim() !== '' && !this.messageStore.isLoading;
        }
    },
    methods: {
        adjustHeight() {
            const textarea = this.$refs.textAreaRef;
            if (!textarea) return;
            textarea.style.height = 'auto';
            const maxHeight = this.maxRows * 24;
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        },
        async handleSubmit() {
            const text = this.inputValue.trim();
            if (!text) return;

            this.inputValue = '';
            if (this.$refs.textAreaRef) {
                this.$refs.textAreaRef.style.height = 'auto';
            }

            const sessionId = this.conversationSession.ensureSession(text);
            await this.messageStore.sendMessage(text, sessionId);
        },
        addNewline(e) {
            e.preventDefault();
            this.inputValue += '\n';
            this.adjustHeight();
        }
    }
})
</script>

<style scoped>
.question-input-wrapper {
    position: relative;
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    max-height: 200px;
    padding: 14px 20px 14px 20px;
    gap: 16px;
    display: flex;
    align-items: end;
    justify-content: space-between;
    box-shadow: var(--shadow-input);
    box-sizing: border-box;
    overflow: hidden;
}

.question-input {
    border: none;
    outline: none;
    width: 100%;
    min-height: 36px;
    max-height: calc(200px - 28px);
    /* Account for wrapper padding */
    font-size: 0.9375rem;
    color: var(--color-text);
    resize: none;
    line-height: 1.5;
    padding: 0;
    margin: 0;
    font-family: inherit;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

/* Center the placeholder text */
.question-input::placeholder {
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.question-input-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: flex-start;
}

.input-wrapper {
    padding: 0 var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.reasoning-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

.toggle-input {
    display: none;
}

.toggle-slider {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 20px;
    background-color: var(--color-border);
    border-radius: 20px;
    transition: background-color 0.2s;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    left: 2px;
    top: 2px;
    background-color: white;
    transition: transform 0.2s;
}

.toggle-input:checked+.toggle-slider {
    background-color: var(--color-primary-dark);
}

.toggle-input:checked+.toggle-slider::before {
    transform: translateX(10px);
}

.toggle-text {
    font-size: 0.8125rem;
    font-weight: 500;
}

.send-icon {
    width: 14px;
    height: 14px;
}

.send-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: var(--color-icon-bg);
    color: var(--color-icon-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: opacity var(--transition-fast);
}

.send-button .div {
    display: flex;
    align-items: center;
    justify-content: center;
}

.send-button:disabled {
    opacity: 0.1;
    cursor: not-allowed;
}

.send-button:not(:disabled):hover {
    opacity: 0.9;
}

.disclaimer {
    margin-top: var(--spacing-sm);
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    padding: 0 var(--spacing-md);
}

.version {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 0.4rem;
}
</style>
