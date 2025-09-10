<template>
    <div class="welcome-message">
        <h1>Que voulez savoir sur les séances du Conseil Municipal de Genève ?</h1>
    </div>
</template>

<script>
export default {
    name: 'WelcomeMessage'
}
</script>

<style scoped>
.welcome-message {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-xl);
}

h1 {
    color: var(--color-text);
    font-size: var(--font-size-hero);
    font-weight: 500;
    line-height: 1.2;
    max-width: 800px;
    margin: 0 auto;
}
</style>
