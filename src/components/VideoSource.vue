<template>
    <div class="video-card" @click="handleClick">
        <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-description">{{ video.description }}</p>
            <div class="video-meta">
                <span class="pill"> {{ video.author }}</span>
                <span class="pill"> {{ video.date }}</span>
                <span class="pill"> {{ video.time }}</span>
                <span class="pill"> {{ video.group }}</span>
            </div>
        </div>
        <div class="video-thumbnail">
            <img :src="video.thumbnail" alt="Video thumbnail" />
        </div>
    </div>
</template>

<script>

export default {
    name: 'VideoSource',
    props: {
        video: {
            type: Object,
            required: true
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
.video-card {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-lg);
    justify-content: space-between;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    cursor: pointer;
}

.video-card:hover {
    background-color: var(--color-surface-hover);
}

.video-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-xs);
}

.video-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
}

.video-description {
    color: var(--color-text);
}

.video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
}



.video-thumbnail {
    position: relative;
    width: 200px;
    overflow: hidden;
    border-radius: var(--radius-md);
    flex-shrink: 0;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>