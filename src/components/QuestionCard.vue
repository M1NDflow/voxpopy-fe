<template>
    <div class="question-card" :style="cssVars" @click="handleClick">
        <component v-if="icon" :is="icon" class="icon" />
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type Component } from 'vue'

export default defineComponent({
    name: 'QuestionCard',
    props: {
        icon: {
            type: [Object, Function] as PropType<Component | null>,
            default: null,
        },
        color: {
            type: String,
            default: '',
        },
    },
    emits: ['select'],
    computed: {
        cssVars(): Record<string, string> {
            if (!this.color) {
                return {}
            }
            // couleur principale
            const main = this.color
            // couleur fond opacité 0.2
            const bg20 = this.colorWithOpacity(main, 0.05)
            // couleur fond opacité 0.4
            const bg40 = this.colorWithOpacity(main, 0.2)
            return {
                '--card-main-color': main,
                '--card-bg-20': bg20,
                '--card-bg-40': bg40,
            }
        },
    },
    methods: {
        // accepte hex (#rrggbb) ou rgb(...) ; retourne rgba
        colorWithOpacity(col: string, alpha: number): string {
            if (col.startsWith('#')) {
                const hex = col.replace('#', '')
                const r = parseInt(hex.substring(0, 2), 16)
                const g = parseInt(hex.substring(2, 4), 16)
                const b = parseInt(hex.substring(4, 6), 16)
                return `rgba(${r}, ${g}, ${b}, ${alpha})`
            }
            // fallback
            return col
        },
        handleClick() {
            this.$emit('select')
        }
    }
})
</script>

<style scoped>
.question-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex: 1;
    background-color: var(--card-bg-20, rgba(211, 211, 211, 0.2));
    border: 1px solid var(--card-bg-40, var(--color-primary-dark));
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    font-weight: 500;
    color: var(--color-text);
    text-align: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.question-card:hover {
    background-color: var(--card-bg-40, rgba(211, 211, 211, 0.4));
}

.icon {
    width: 24px;
    height: 24px;
    margin-bottom: var(--spacing-sm);
    color: var(--card-main-color, var(--color-primary-dark));
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
</style>