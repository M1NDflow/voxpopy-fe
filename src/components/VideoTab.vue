<template>
    <div class="video-list">
        <VideoSource v-for="video in videos" :key="video.id" :video="video" @open="handleOpen" />
        <VideoModal :visible="videoModalVisible" @close="closeModal" />

    </div>
</template>

<script>
import VideoSource from './VideoSource.vue'
import VideoModal from './VideoModal.vue'

export default {
    name: 'VideoTab',
    components: { VideoSource, VideoModal },
    data() {
        return {
            videoModalVisible: false,
            videos: [
                {
                    id: 1,
                    title: 'Une motion qui fait débat au Conseil municipal',
                    description: 'Retour en images sur la séance du 4 février 2025...',
                    author: 'Frédéric Begbeider',
                    date: '27 Février 2025',
                    time: '20h30',
                    group: 'Les Vert·e·s',
                    thumbnail: 'https://via.placeholder.com/200x100?text=Video+1'
                },
                {
                    id: 2,
                    title: 'Sécuriser ou réaménager ?',
                    description: 'Cette vidéo explique les arguments des différents partis politiques...',
                    author: 'Frédéric Begbeider',
                    date: '27 Février 2025',
                    time: '20h30',
                    group: 'Les Vert·e·s',
                    thumbnail: 'https://via.placeholder.com/200x100?text=Video+2'
                },
                {
                    id: 3,
                    title: 'Vers une étude de faisabilité pour le pont du Mont-Blanc',
                    description: 'Focus sur la décision finale du Conseil municipal...',
                    author: 'Frédéric Begbeider',
                    date: '27 Février 2025',
                    time: '20h30',
                    group: 'Les Vert·e·s',
                    thumbnail: 'https://via.placeholder.com/200x100?text=Video+3'
                }
            ]
        }
    },
    methods: {
        handleOpen(payload) {
            this.videoModalVisible = true
        },
        closeModal() {
            this.videoModalVisible = false
        }
    }

}
</script>

<style scoped>
.video-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}
</style>