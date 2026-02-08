<script setup lang="ts">
import { computed, ref } from 'vue'

type AuditEntryType = 'create' | 'update' | 'delete' | 'system'

interface AuditEntry {
  id: string
  type: AuditEntryType
  action: string
  detail?: string
  user?: string
  timestamp: Date | string
  metadata?: Record<string, unknown>
}

interface Props {
  entries: AuditEntry[]
  maxHeight?: string
  showFilters?: boolean
  emptyMessage?: string
  order?: 'newest' | 'oldest'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showFilters: false,
  emptyMessage: 'No activity yet',
  order: 'newest',
  size: 'md',
})

const emit = defineEmits<{
  'entry-click': [entry: AuditEntry]
}>()

const filterType = ref<AuditEntryType | ''>('')
const filterUser = ref('')

const uniqueTypes = computed(() => {
  const types = new Set(props.entries.map(e => e.type))
  return Array.from(types)
})

const uniqueUsers = computed(() => {
  const users = new Set(props.entries.filter(e => e.user).map(e => e.user!))
  return Array.from(users)
})

const filteredEntries = computed(() => {
  let result = props.entries
  if (filterType.value) {
    result = result.filter(e => e.type === filterType.value)
  }
  if (filterUser.value) {
    result = result.filter(e => e.user === filterUser.value)
  }
  return result
})

const sortedEntries = computed(() => {
  const entries = [...filteredEntries.value]
  entries.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return props.order === 'newest' ? timeB - timeA : timeA - timeB
  })
  return entries
})

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return (words[0]?.[0] ?? '').toUpperCase()
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

function formatTimestamp(timestamp: Date | string): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const now = Date.now()
  const diffMs = date.getTime() - now
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHr / 24)
  const diffWeek = Math.round(diffDay / 7)

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second')
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour')
  if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day')
  if (Math.abs(diffWeek) < 5) return rtf.format(diffWeek, 'week')
  return date.toLocaleDateString()
}

function handleEntryClick(entry: AuditEntry) {
  emit('entry-click', entry)
}
</script>

<template>
  <div :class="['mld-audit-trail', `mld-audit-trail--${size}`]">
    <div v-if="showFilters" class="mld-audit-trail__filters">
      <select v-model="filterType" class="mld-audit-trail__filter-select">
        <option value="">All types</option>
        <option v-for="t in uniqueTypes" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="filterUser" class="mld-audit-trail__filter-select">
        <option value="">All users</option>
        <option v-for="u in uniqueUsers" :key="u" :value="u">{{ u }}</option>
      </select>
    </div>

    <div
      v-if="sortedEntries.length"
      class="mld-audit-trail__list"
      :style="maxHeight ? { maxHeight, overflowY: 'auto' } : {}"
    >
      <div class="mld-audit-trail__line" />
      <div
        v-for="entry in sortedEntries"
        :key="entry.id"
        :class="['mld-audit-trail__entry', `mld-audit-trail__entry--${entry.type}`]"
        @click="handleEntryClick(entry)"
      >
        <slot name="entry" :entry="entry">
          <div class="mld-audit-trail__dot" />
          <div class="mld-audit-trail__content">
            <div class="mld-audit-trail__header">
              <div v-if="entry.user" class="mld-audit-trail__avatar">{{ getInitials(entry.user) }}</div>
              <span v-if="entry.user" class="mld-audit-trail__user">{{ entry.user }}</span>
              <span class="mld-audit-trail__timestamp">{{ formatTimestamp(entry.timestamp) }}</span>
            </div>
            <div class="mld-audit-trail__action">{{ entry.action }}</div>
            <div v-if="entry.detail" class="mld-audit-trail__detail">{{ entry.detail }}</div>
            <div v-if="entry.metadata && Object.keys(entry.metadata).length" class="mld-audit-trail__metadata">
              <span
                v-for="(value, key) in entry.metadata"
                :key="String(key)"
                class="mld-audit-trail__metadata-item"
              >
                <span class="mld-audit-trail__metadata-key">{{ key }}:</span>
                {{ value }}
              </span>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <div v-if="!sortedEntries.length" class="mld-audit-trail__empty">
      <slot name="empty">{{ emptyMessage }}</slot>
    </div>
  </div>
</template>

<style>
@import '../styles/components/audit-trail.css';
</style>
