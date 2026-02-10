<script setup lang="ts">
import { ref } from 'vue'
import TagsInput from './TagsInput.vue'

const sizes = ['sm', 'md', 'lg'] as const
const sampleTags = ref(['HeLa', 'MCF-7', 'A549'])
const emptyTags = ref<string[]>([])
</script>

<template>
  <Story title="Base Inputs/TagsInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <TagsInput
            v-model="state.tags"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :max-tags="state.useMaxTags ? state.maxTags : undefined"
            :allow-duplicates="state.allowDuplicates"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Tags: <code>{{ JSON.stringify(state.tags) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.allowDuplicates" title="Allow Duplicates" />
        <HstCheckbox v-model="state.useMaxTags" title="Limit Max Tags" />
        <HstSlider v-model="state.maxTags" title="Max Tags" :min="1" :max="20" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <TagsInput v-model="sampleTags" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="With Placeholder">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <TagsInput
          v-model="emptyTags"
          placeholder="Type a cell line and press Enter..."
        />
      </div>
    </Variant>

    <Variant title="Pre-filled Tags">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <TagsInput
          :model-value="['DMSO', 'Staurosporine', 'Doxorubicin', 'Paclitaxel', 'Cisplatin']"
          placeholder="Add compound..."
        />
      </div>
    </Variant>

    <Variant title="Max Tags Limit">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Maximum 3 tags allowed</p>
        <TagsInput
          :model-value="['Tag 1', 'Tag 2']"
          :max-tags="3"
          placeholder="Add up to 3 tags..."
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <TagsInput
          :model-value="['invalid-tag']"
          error
          placeholder="Fix the tags..."
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <TagsInput
          :model-value="['Read', 'Only', 'Tags']"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
