<script setup lang="ts">
export interface EventDefinition {
  name: string
  payload: string
  description: string
}

defineProps<{
  events: readonly EventDefinition[]
}>()
</script>

<template>
  <table class="props-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in events" :key="event.name">
        <td><code>{{ event.name }}</code></td>
        <td><code>{{ event.payload }}</code></td>
        <td>{{ event.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
