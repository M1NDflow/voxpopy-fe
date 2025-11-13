<template>
  <div class="video-segment-meta">
    <p v-if="showDate && dateLabel" class="video-date">{{ dateLabel }}</p>
    <div class="video-title-speaker">
      <h3 class="video-title-speaker">
        <span class="speaker-badge"
          :class="{ 'is-clickable': !!segment?.speaker_url, 'is-static': !segment?.speaker_url }">
          <template v-if="segment?.speaker_url">
            <a :href="segment.speaker_url" class="speaker-link" target="_blank" rel="noopener noreferrer">
              {{ speakerLabel }}
            </a>
          </template>
          <template v-else>
            {{ speakerLabel }}
          </template>
        </span>
      </h3>
      <h3 class="video-title-datetime">
        · {{ formatSegmentTime(segment?.seance_date, segment?.start_second) }} ·
      </h3>
      <h3 class="video-title-political-group">
        ( {{ segment?.political_group || 'Inconnu' }} )
      </h3>
    </div>
    <div class="video-title">
      <h3 class="video-title-seance">{{ title }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { EnrichedSegment } from '@/types/enriched_segments'
import { formatSegmentTime, formatSegmentDate } from '@/types/enriched_segments'

export default defineComponent({
  name: 'VideoSegmentMeta',
  props: {
    segment: {
      type: Object as PropType<EnrichedSegment | undefined>,
      default: undefined
    },
    title: {
      type: String,
      default: ''
    },
    showDate: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const speakerLabel = computed(() => {
      if (props.segment?.speaker_name) return props.segment?.speaker_name
      if (props.segment?.cue_type === 'VOTING') return 'Président(e)'
      return 'Inconnu'
    })
    const dateLabel = computed(() => {
      if (!props.segment?.seance_date) return ''
      return formatSegmentDate(props.segment.seance_date)
    })
    return { speakerLabel, formatSegmentTime, dateLabel }
  }
})
</script>

<style scoped>
.video-segment-meta {
  display: flex;
  flex-direction: column;
}

.video-date {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-subtitle2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.video-title-speaker {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-dark);
  vertical-align: middle;
}



.video-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xs);
}

.video-title-datetime {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: var(--color-text-subtitle2);
  vertical-align: middle;
}

.video-title-political-group {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);
  color: var(--color-text-subtitle2);
  vertical-align: middle;
}

.video-title-seance {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-subtitle1);
  vertical-align: middle;
}

.speaker-link {
  color: inherit;
  text-decoration: none;
}

.speaker-link:hover,
.speaker-link:focus-visible {
  text-decoration: underline;
}

.speaker-badge {
  border: 1px solid currentColor;
  border-radius: var(--border-radius-sm);
  padding: 2px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background-color var(--transition-fast);
}

.speaker-badge.is-clickable {
  cursor: pointer;
}

.speaker-badge.is-clickable:hover,
.speaker-badge.is-clickable:focus-within {
  background-color: rgba(180, 148, 101, 0.05);
}

.speaker-badge.is-static {
  border-color: transparent;
  padding: 0;
  color: rgba(127, 127, 127, 0.93);
  font-weight: var(--font-weight-light);
  cursor: default;
}
</style>
