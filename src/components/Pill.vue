<template>
    <component :is="url ? 'a' : 'div'" class="pill" :class="{ clickable: !!url }" :role="url ? 'link' : 'note'"
        :href="url || undefined" :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener noreferrer' : undefined" :aria-label="`${tag} ${description}`">
        <component v-if="icon" :is="icon" class="icon" />
        <span class="tag" v-if="tag">{{ tag }}</span>
        <span class="desc" v-if="description">{{ description }}</span>
    </component>
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
        url: {
            type: String,
            default: '',
        },
    },
    computed: {
        isExternal(): boolean {
            return /^https?:\/\//i.test(this.url)
        },
    }
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

    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease;
}

.pill.clickable {
    cursor: pointer;
}

.pill.clickable:hover {
    background-color: var(--surface-hover, rgba(0, 0, 0, 0.04));
    border-color: var(--color-border-strong, var(--color-border));
}

.pill.clickable:focus-visible {
    outline: 2px solid var(--color-focus, #5b9dd9);
    outline-offset: 2px;
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
    color: var(--color-text-subtitle1);
}
</style>