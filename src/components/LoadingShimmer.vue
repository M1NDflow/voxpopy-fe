<template>
    <div class="shimmer-wrapper">
        <p class="shimmer-text">{{ currentPhrase }}</p>
    </div>
</template>

<script>
export default {
    name: 'LoadingShimmer',
    data() {
        return {
            phrases: [
                'Traitement de la question...',
                'Analyse des sources...',
                'Récupération des vidéos...',
                'Génération de la réponse...',
                'Lecture des documents...'
            ],
            index: 0,
            intervalId: null
        };
    },
    computed: {
        currentPhrase() {
            return this.phrases[this.index];
        }
    },
    mounted() {
        this.intervalId = setInterval(() => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.phrases.length);
            } while (newIndex === this.index && this.phrases.length > 1);
            this.index = newIndex;
        }, 2500); // Change every 2.5 seconds
    },
    beforeUnmount() {
        clearInterval(this.intervalId);
    }
};
</script>

<style scoped>
.shimmer-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.shimmer-text {
    font-size: 1rem;
    font-weight: 500;
    background: linear-gradient(90deg, #999, #eee, #999);
    background-size: 300% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s infinite;
    text-align: center;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

@keyframes shimmer {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 200% 50%;
    }
}
</style>