<script>
import Navbar from './components/Navbar.vue'
import MainContent from './components/MainContent.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    MainContent,
    Footer
  }
}
</script>

<template>
  <div class="app-container">
    <Navbar />
    <MainContent />
    <Footer />
  </div>
</template>

<style>
/* Base layout reset kept lean; detailed styles live in components */
html,
body,
#app {
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  padding-bottom: var(--spacing-md);
}
</style>
