<script setup lang="ts">
export interface PropDefinition {
  name: string
  type: string
  default?: string
  description: string
}

defineProps<{
  props: readonly PropDefinition[]
}>()
</script>

<template>
  <table class="props-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="prop in props" :key="prop.name">
        <td><code>{{ prop.name }}</code></td>
        <td><code>{{ prop.type }}</code></td>
        <td>
          <code v-if="prop.default">{{ prop.default }}</code>
          <span v-else>-</span>
        </td>
        <td>{{ prop.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
