<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DocumentTextIcon, VideoCameraIcon } from '@heroicons/vue/24/solid'

export default defineComponent({
    name: 'ResponseSource',
    components: { DocumentTextIcon, VideoCameraIcon },
    emits: ['open'],
    props: {
        type: { type: String as PropType<'video' | 'document'>, required: true },
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        id: { type: [String, Number], default: null }
    },
    methods: {
        handleClick() {
            this.$emit('open', { id: this.id, type: this.type, url: this.url ?? "" })
        }
    }
})
</script>

<template>
    <div class="card" role="button" @click="handleClick">
        <div class="card-header">
            <span v-if="type === 'video'">
                <VideoCameraIcon class="icon" />
            </span>
            <span v-if="type === 'video'" class="type">Vidéo</span>
            <span v-else-if="type === 'document'">
                <DocumentTextIcon class="icon" />
            </span>
            <span v-if="type === 'document'" class="type">Document</span>
        </div>
        <p class="title">{{ title }}</p>
    </div>
</template>


<style scoped>
.card {
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    width: 200px;
    min-width: 200px;
    background: var(--color-card);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.card span {
    display: flex;
    align-items: center;
    color: var(--color-text);
    opacity: 0.7;
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.card:hover {
    background-color: var(--color-surface-hover);
}

.card .type {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-subtitle1);
}

.card .title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-subtitle2);
    margin: 0;
}
</style>