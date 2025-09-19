<template>
    <div class="answer">
        <p v-for="(parts, i) in paragraphs" :key="i" class="answer-paragraph">
            <template v-for="(part, j) in parts" :key="j">
                <span v-if="part.t === 'text'">{{ part.text }}</span>
                <span v-else class="chip" :class="`chip--${part.kind}`"
                    @click="onChipClick(part.kind, part.id, part?.url)"
                    :title="part.kind === 'seg' ? 'Ouvrir la vidéo' : 'Ouvrir le document'">
                    <div v-if="part.kind === 'seg'" class="chip-content">
                        <div class="icon-wrapper">
                            <VideoCameraIcon class="icon" />
                        </div>
                        <p>{{ part.title }}</p>
                    </div>
                    <div v-else class="chip-content">
                        <div class="icon-wrapper">
                            <DocumentIcon class="icon" />
                        </div>
                        <p>{{ part.title }}</p>
                    </div>
                </span>
            </template>
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { VideoCameraIcon, DocumentIcon } from '@heroicons/vue/24/solid'

export default defineComponent({
    name: 'AnswerWithSources',
    components: { VideoCameraIcon, DocumentIcon },
    props: {
        message: { type: Object, required: true },
    },
    emits: ['open-seg', 'open-doc'],
    setup(props, { emit }) {
        // Split into paragraphs, then within each paragraph split into text + chips
        const paragraphs = computed(() => {
            const resp = props.message?.responseData?.response ?? ''
            const segs = props.message?.responseData?.segments ?? []
            const docs = props.message?.responseData?.documents ?? []

            // Build fast id → title maps (ids compared in lowercase)
            const segTitleById = new Map<string, string>(
                segs.map(s => [String(s.id).toLowerCase(), s.title ?? 'Segment sans titre'])
            )
            const docTitleById = new Map<string, string>(
                docs.map(d => [String(d.id).toLowerCase(), d.title ?? 'Document sans titre'])
            )

            // Match both [seg:…] and [doc:…] markers (uuid or shortened ids)
            const tokenRe = /\[(seg|doc):([0-9a-fA-F-]+)\]/g

            return resp.split(/\n{2,}/).map((para) => {
                const parts: Array<
                    | { t: 'text'; text: string }
                    | { t: 'chip'; kind: 'seg' | 'doc'; id: string; title: string; url?: string }
                > = []

                let last = 0
                para.replace(tokenRe, (match, kind: 'seg' | 'doc', rawId: string, offset: number) => {
                    if (offset > last) parts.push({ t: 'text', text: para.slice(last, offset) })

                    const id = rawId.toLowerCase()
                    const title =
                        kind === 'seg'
                            ? (segTitleById.get(id) ?? `Intervention Présidentielle`)
                            : (docTitleById.get(id) ?? `Document ${rawId}`)
                    const url = kind === 'seg' ? null : docs.find(d => d.id === id)?.document_url
                    parts.push({ t: 'chip', kind, id, title, url })
                    last = offset + match.length
                    return '' // required by String.replace callback
                })

                if (last < para.length) parts.push({ t: 'text', text: para.slice(last) })
                return parts
            })
        })

        function onChipClick(kind: 'seg' | 'doc', id: string, url?: string | null) {
            if (kind === 'seg') {
                emit('open-seg', id)
            } else {
                emit('open-doc', { id, url })
            }
        }

        return { paragraphs, onChipClick, VideoCameraIcon, DocumentIcon }
    },
})
</script>

<style scoped>
.answer-paragraph {
    margin: 0 0 1rem 0;
    line-height: 1.6;
    white-space: pre-wrap;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    width: 10px;
    height: 10px;
    color: rgba(192, 195, 201, 0.9);
}

/* little inline “chips” that act like citations */
.chip {
    margin-left: 6px;
    border: 1px solid var(--color-border);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    cursor: pointer;
    user-select: none;
}

.chip-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.chip--seg {
    background: rgba(219, 229, 254, 0.08);
}

.chip--doc {
    background: rgba(219, 229, 254, 0.08);
}
</style>