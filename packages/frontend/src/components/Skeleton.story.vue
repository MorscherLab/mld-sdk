<script setup lang="ts">
import Skeleton from './Skeleton.vue'

const variants: ('text' | 'circular' | 'rectangular' | 'rounded')[] = ['text', 'circular', 'rectangular', 'rounded']
const animations: ('pulse' | 'wave' | 'none')[] = ['pulse', 'wave', 'none']
</script>

<template>
  <Story title="Data Display/Skeleton">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <Skeleton
            :variant="state.variant"
            :animation="state.animation"
            :width="state.width || undefined"
            :height="state.height || undefined"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstSelect
          v-model="state.animation"
          title="Animation"
          :options="animations.map(a => ({ label: a, value: a }))"
        />
        <HstText v-model="state.width" title="Width (e.g. 200px, 50%)" />
        <HstText v-model="state.height" title="Height (e.g. 40px)" />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="variant in variants" :key="variant">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ variant }}
          </p>
          <Skeleton :variant="variant" />
        </div>
      </div>
    </Variant>

    <Variant title="Animation Types">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="animation in animations" :key="animation">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ animation }}
          </p>
          <Skeleton variant="text" :animation="animation" />
        </div>
      </div>
    </Variant>

    <Variant title="Card Loading Pattern">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <div style="border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <Skeleton variant="circular" width="48" height="48" />
            <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <Skeleton variant="rounded" height="160" />
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="75%" />
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Table Loading Pattern">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; gap: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color, #e2e8f0);">
            <Skeleton variant="text" width="60px" height="14" />
            <Skeleton variant="text" width="120px" height="14" />
            <Skeleton variant="text" width="80px" height="14" />
            <Skeleton variant="text" width="100px" height="14" />
          </div>
          <div v-for="i in 5" :key="i" style="display: flex; gap: 1rem;">
            <Skeleton variant="text" width="60px" />
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="text" width="80px" />
            <Skeleton variant="text" width="100px" />
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Custom Sizes">
      <div style="padding: 2rem; display: flex; gap: 1.5rem; align-items: flex-start; justify-content: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Skeleton variant="circular" width="32" height="32" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">32px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Skeleton variant="circular" width="48" height="48" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">48px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Skeleton variant="circular" width="64" height="64" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">64px</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <Skeleton variant="circular" width="96" height="96" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">96px</span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
