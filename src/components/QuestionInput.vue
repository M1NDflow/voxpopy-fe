<template>
    <div class="container input-wrapper">
        <div class="question-input-wrapper">
            <textarea ref="textAreaRef" v-model="inputValue" class="question-input" :placeholder="placeholder" :rows="1"
                @input="adjustHeight" @keydown.enter.exact.prevent="handleSubmit"
                @keydown.enter.shift.exact.prevent="addNewline"></textarea>
            <button class="send-button" @click="handleSubmit" :disabled="!isSendEnabled" :aria-label="buttonLabel">
                <div>
                    <PaperAirplaneIcon class="send-icon" />
                </div>
            </button>
        </div>
        <p class="disclaimer">
            ViaDemocratia peut commettre des erreurs. Il est recommandé de vérifier les informations importantes. Les
            informations ne sont en aucun cas des conseils politiques
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMessageStore } from '@/stores/messageStore';
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

export default defineComponent({
    name: 'QuestionInput',
    components: {
        PaperAirplaneIcon
    },
    data() {
        return {
            inputValue: '',
            messageStore: useMessageStore(),
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

            await this.messageStore.sendMessage(text);
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
    background: transparent;
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

.input-wrapper {
    padding: 0 var(--spacing-xl);
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
</style>
