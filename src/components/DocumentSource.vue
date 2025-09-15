<template>
    <a class="document-card" :href="document.document_url" target="_blank" rel="noopener noreferrer">

        <svg width="64" height="64" viewBox="0 0 197 197" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="197" height="197" rx="26" fill="#FDBE40" fill-opacity="0.25" />
            <path
                d="M55.8352 116V81.0909H68.2784C70.9943 81.0909 73.2443 81.5852 75.0284 82.5739C76.8125 83.5625 78.1477 84.9148 79.0341 86.6307C79.9205 88.3352 80.3636 90.2557 80.3636 92.392C80.3636 94.5398 79.9148 96.4716 79.017 98.1875C78.1307 99.892 76.7898 101.244 74.9943 102.244C73.2102 103.233 70.9659 103.727 68.2614 103.727H59.7045V99.2614H67.7841C69.5 99.2614 70.892 98.9659 71.9602 98.375C73.0284 97.7727 73.8125 96.9545 74.3125 95.9205C74.8125 94.8864 75.0625 93.7102 75.0625 92.392C75.0625 91.0739 74.8125 89.9034 74.3125 88.8807C73.8125 87.858 73.0227 87.0568 71.9432 86.4773C70.875 85.8977 69.4659 85.608 67.7159 85.608H61.1023V116H55.8352ZM97.8395 116H86.5384V81.0909H98.1974C101.618 81.0909 104.555 81.7898 107.01 83.1875C109.464 84.5739 111.345 86.5682 112.652 89.1705C113.97 91.7614 114.629 94.8693 114.629 98.4943C114.629 102.131 113.964 105.256 112.635 107.869C111.317 110.483 109.408 112.494 106.908 113.903C104.408 115.301 101.385 116 97.8395 116ZM91.8054 111.398H97.5497C100.209 111.398 102.419 110.898 104.18 109.898C105.942 108.886 107.26 107.426 108.135 105.517C109.01 103.597 109.447 101.256 109.447 98.4943C109.447 95.7557 109.01 93.4318 108.135 91.5227C107.271 89.6136 105.982 88.1648 104.266 87.1761C102.55 86.1875 100.419 85.6932 97.8736 85.6932H91.8054V111.398ZM121.179 116V81.0909H142.827V85.625H126.446V96.2614H141.276V100.778H126.446V116H121.179Z"
                fill="#FDBE40" />
        </svg>

        <div class="document-info">
            <h3 class="document-title">{{ document.title }}</h3>
            <p class="document-description">{{ document.summary.slice(0, 200) + "..." }}</p>
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

.document-card .svg {
    height: 100%
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
</style>