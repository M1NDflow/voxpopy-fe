<template>
    <teleport to="main">
        <transition name="backdrop-fade" appear>

            <div v-if="visible" class="video-modal-wrapper" @click.self="handleClickOutside">
                <transition name="modal-fade" appear>
                    <div class="video-modal">
                        <div class="video-modal-header">
                            <div class="nav-left">
                                <p class="nav-link" @click.self="handleClickOutside">Fermer</p>
                            </div>
                            <div class="nav-right">
                                <button class="nav-link">Vidéo précedente</button>
                                <button class="nav-link disabled">Vidéo suivante</button>
                            </div>
                        </div>

                        <div class="video-modal-body">
                            <h2 class="video-title">Une motion qui fait débat au Conseil municipal</h2>

                            <div class="video-player-wrapper">
                                <img src="https://via.placeholder.com/800x450?text=Video+Player" alt="Video player" />
                                <div class="play-overlay">▶</div>
                            </div>

                            <div class="video-meta">
                                <span class="pill">👤 ALONSO UNICA Manuel</span>
                                <span class="pill">📅 27 Février 2025</span>
                                <span class="pill">⏰ 20h30</span>
                                <span class="pill">🏛️ Les Vert·e·s</span>
                            </div>

                            <div class="transcript-section">
                                <div class="transcript-header">
                                    <h3>Transcript</h3>
                                </div>
                                <p class="transcript-text">
                                    Merci, Madame la Présidente. Il est clair qu’avec le vieillissement de la
                                    population, un
                                    certain
                                    nombre de logements devront, dans les années qui viennent, être adaptés. [...]
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

    </teleport>
</template>

<script>
export default {
    name: 'VideoModal',
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close'],
    mounted() {
        window.addEventListener('keydown', this.handleEscape)
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEscape)
    },
    methods: {
        handleEscape(e) {
            if (e.key === 'Escape') this.$emit('close')
        },
        handleClickOutside() {
            this.emitClose()
        },
        emitClose() {
            this.$emit('close')
        }
    }

}
</script>

<style scoped>
.video-modal-wrapper {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    /* darken background */
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}

.video-modal {
    width: 700px;
    max-width: 100%;
    height: 100%;
    background-color: var(--color-bg, #fff);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-lg);
    overflow-y: auto;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.video-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.nav-link {
    background: none;
    border: none;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
}

.nav-link.disabled {
    color: var(--color-text-disabled, #bbb);
    cursor: not-allowed;
}

.video-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: var(--spacing-md);
}

.video-player-wrapper {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
}

.video-player-wrapper img {
    width: 100%;
    display: block;
}

.play-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: white;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xl);
}

.transcript-section {
    margin-top: var(--spacing-md);
}

.transcript-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.transcript-header h3 {
    margin: 0;
    font-size: 1rem;
}

.transcript-actions {
    display: flex;
    gap: var(--spacing-xs);
}

.small-button {
    font-size: 0.75rem;
    padding: 4px 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    cursor: pointer;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

/* Fade in the dark backdrop */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
    transition: opacity 0.2s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
    opacity: 0;
}
</style>