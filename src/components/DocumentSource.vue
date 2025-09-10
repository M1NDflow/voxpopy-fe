<template>
    <a class="document-card" :href="document.url" target="_blank" rel="noopener noreferrer">
        <div class="document-info">
            <h3 class="document-title">{{ document.title }}</h3>
            <p class="document-description">{{ document.description }}</p>
        </div>
        <div class="document-button" :href="document.url" target="_blank" rel="noopener noreferrer">
            <span>↗</span> Voir le document
        </div>
    </a>
</template>

<script>
export default {
    name: 'DocumentSource',
    props: {
        document: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.document-card {
    display: flex;
    text-decoration: none;
    color: inherit;
    flex-direction: row;
    gap: var(--spacing-lg);
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
}

.document-card:hover {
    background-color: var(--color-surface-hover);
}

.document-info {
    flex: 1;
}

.document-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
}

.document-description {
    color: var(--color-text);
}

.document-button {
    border: 1px solid var(--color-border);
    padding: 6px 16px;
    height: 36px;
    border-radius: var(--border-radius-md);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 6px;
    background: white;
    white-space: nowrap;
    text-decoration: none;
    color: inherit;
    transition: background 0.2s;
}

.document-button:hover {
    background: var(--color-surface-hover, #f5f5f5);
}
</style>