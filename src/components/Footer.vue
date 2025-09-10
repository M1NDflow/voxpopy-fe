<template>
  <footer class="footer">
    <QuestionInput v-model="question" :placeholder="'Poser une question'" :button-label="'Envoyer la question'"
      @submit="handleSubmit" />

  </footer>
</template>

<script>
import QuestionInput from './QuestionInput.vue'

export default {
  name: 'Footer',
  components: {
    QuestionInput
  },
  data() {
    return {
      question: ''
    }
  },
  methods: {
    handleSubmit(question) {
      this.$emit('send', question)
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  isolation: isolate;
  background: linear-gradient(180deg, transparent, var(--color-bg-hero));
  z-index: 10;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
