<template>
    <div class="pill" role="note" :aria-label="`${tag} ${description}`">
        <component v-if="icon" :is="icon" class="icon" />
        <span class="tag" v-if="tag">{{ tag }}</span>
        <span class="desc" v-if="description">{{ description }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type Component } from 'vue'

export default defineComponent({
    name: 'Pill',
    props: {
        icon: {
            type: [Object, Function] as PropType<Component | null>,
            default: null,
        },
        tag: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
    },
})
</script>

<style scoped>
.pill {
    border: 1px solid var(--color-border);
    padding: 4px 8px;
    border-radius: var(--border-radius-sm);
    color: var(--color-text-subtitle1);
    font-size: 0.75rem;
    white-space: nowrap;

    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    color: var(--color-text-subtitle1);
}

.tag {
    font-weight: 600;
}

.desc {
    opacity: 0.9;
}
</style>