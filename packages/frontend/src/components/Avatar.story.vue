<script setup lang="ts">
import Avatar from './Avatar.vue'

const sizes: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[] = ['xs', 'sm', 'md', 'lg', 'xl']

const users = [
  { name: 'Alice Morscher', color: undefined },
  { name: 'Bob Chen', color: undefined },
  { name: 'Clara Diaz', color: undefined },
  { name: 'David Kim', color: undefined },
  { name: 'Elena Rossi', color: undefined },
]
</script>

<template>
  <Story title="Data Display/Avatar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <Avatar
            :name="state.name"
            :initials="state.initials || undefined"
            :src="state.src || undefined"
            :size="state.size"
            :color="state.color || undefined"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.name" title="Name" />
        <HstText v-model="state.initials" title="Initials (override)" />
        <HstText v-model="state.src" title="Image URL" />
        <HstText v-model="state.color" title="Color (hex)" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; gap: 1.5rem; align-items: center; justify-content: center;">
        <div v-for="size in sizes" :key="size" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar name="Alice Morscher" :size="size" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </span>
        </div>
      </div>
    </Variant>

    <Variant title="Name-based Colors">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <div v-for="user in users" :key="user.name" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Avatar :name="user.name" size="lg" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">{{ user.name.split(' ')[0] }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Custom Initials">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <Avatar initials="PI" name="Principal Investigator" size="lg" />
        <Avatar initials="RA" name="Research Assistant" size="lg" />
        <Avatar initials="QC" name="Quality Control" size="lg" color="#10B981" />
      </div>
    </Variant>

    <Variant title="With Image">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <Avatar
          src="https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=3B82F6"
          name="Alice Morscher"
          size="lg"
        />
        <Avatar
          src="https://api.dicebear.com/7.x/initials/svg?seed=BC&backgroundColor=8B5CF6"
          name="Bob Chen"
          size="lg"
        />
      </div>
    </Variant>

    <Variant title="Fallback (No Name)">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <Avatar v-for="size in sizes" :key="size" :size="size" />
      </div>
    </Variant>
  </Story>
</template>
