<template>
    <div class="card" @click="handleClick">
        <span class="type">{{ type }}</span>
        <p class="title">{{ title }}</p>
    </div>
</template>

<script>
export default {
    name: 'ResponseSource',
    props: {
        type: String,
        title: String,
        url: {
            type: String,
            default: ''
        },
        id: {
            type: [String, Number],
            default: null
        }
    },
    methods: {
        handleClick() {
            this.$emit('open', { id: this.id, type: this.type, url: this.url })
        }
    }
}
</script>

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