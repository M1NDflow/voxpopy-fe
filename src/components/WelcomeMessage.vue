<template>
    <div class="welcome-message">
        <h1>
            Interrogez-moi sur une séance, un thème, un parti ou un membre du conseil
        </h1>

        <QuestionGrid />

        <p>
            <a href="https://www.geneve.ch/autorites-administration/conseil-municipal/">
                Le Conseil municipal de la Ville de Genève
            </a>
            est le parlement de la Ville de Genève. Il compte
            <a href="https://www.geneve.ch/autorites-administration/conseil-municipal/membres/">
                80 membres
            </a>
            élus pour cinq ans. Il représente la population et vote le budget, les comptes, les crédits et les
            règlements. Les séances sont publiques, diffusées en direct sur Léman Bleu puis en différé sur le site.

        </p>
        <p>
            Le projet ViaDemocratIA vise à rendre ces débats plus accessibles afin de promouvoir notre démocratie. Ce
            prototype couvre les séances de
            <a
                href="https://www.geneve.ch/autorites-administration/conseil-municipal/seances-plenieres/session-04-02-2025">février</a>
            et
            <a
                href="https://www.geneve.ch/autorites-administration/conseil-municipal/seances-plenieres/session-11-03-2025">mars</a>
            2025.
        </p>

    </div>
</template>

<script>
import QuestionGrid from './QuestionGrid.vue'
export default {
    name: 'WelcomeMessage',
    components: {
        QuestionGrid
    }
}
</script>

<style scoped>
.welcome-message {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 800px;
    gap: var(--spacing-xl);
    color: var(--color-text-secondary);
    padding: var(--spacing-xl);
    font-size: var(--font-size-xs);
}

h1 {
    color: var(--color-text);
    font-size: var(--font-size-hero);
    font-weight: 500;
    line-height: 1.2;
    max-width: 800px;
    margin: 0 auto;
}

.a {
    color: var(--color-primary-dark);
    text-decoration: none;
}
</style>
