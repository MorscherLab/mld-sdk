<script setup lang="ts">
import AppContainer from './AppContainer.vue'
</script>

<template>
  <Story title="Layout/AppContainer">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <AppContainer
            :scrollable="state.scrollable"
            :direction="state.direction || undefined"
            :gap="state.gap"
          >
            <div style="padding: 1.5rem;">
              <h3 style="margin: 0 0 0.5rem; color: var(--text-primary, #1e293b);">Container Content</h3>
              <p style="margin: 0; color: var(--text-muted, #94a3b8);">
                This content is wrapped in an AppContainer component.
              </p>
            </div>
          </AppContainer>
        </div>
      </template>

      <template #controls="{ state }">
        <HstCheckbox v-model="state.scrollable" title="Scrollable" />
        <HstSelect
          v-model="state.direction"
          title="Direction"
          :options="[
            { label: 'none (card)', value: '' },
            { label: 'row', value: 'row' },
            { label: 'column', value: 'column' },
          ]"
        />
        <HstText v-model="state.gap" title="Gap" />
      </template>
    </Variant>

    <Variant title="Card Mode (Default)">
      <div style="padding: 2rem;">
        <AppContainer>
          <div style="padding: 1.5rem;">
            <h3 style="margin: 0 0 0.5rem; color: var(--text-primary, #1e293b);">Card Container</h3>
            <p style="margin: 0; color: var(--text-muted, #94a3b8);">
              Default card mode with background and border styling.
            </p>
          </div>
        </AppContainer>
      </div>
    </Variant>

    <Variant title="Row Layout">
      <div style="padding: 2rem;">
        <AppContainer direction="row" gap="1rem">
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem; flex: 1;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Panel 1</p>
          </div>
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem; flex: 1;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Panel 2</p>
          </div>
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem; flex: 1;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Panel 3</p>
          </div>
        </AppContainer>
      </div>
    </Variant>

    <Variant title="Column Layout">
      <div style="padding: 2rem;">
        <AppContainer direction="column" gap="0.75rem">
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Section A</p>
          </div>
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Section B</p>
          </div>
          <div style="padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Section C</p>
          </div>
        </AppContainer>
      </div>
    </Variant>

    <Variant title="Scrollable">
      <div style="padding: 2rem;">
        <AppContainer :scrollable="true">
          <div style="padding: 1.5rem; height: 200px; overflow: hidden;">
            <h3 style="margin: 0 0 1rem; color: var(--text-primary, #1e293b);">Scrollable Container</h3>
            <div style="height: 400px;">
              <p style="color: var(--text-muted, #94a3b8);">This container has more content than its visible area. Scroll to see more.</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 1 of many...</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 2 of many...</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 3 of many...</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 4 of many...</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 5 of many...</p>
              <p style="color: var(--text-muted, #94a3b8);">Line 6 of many...</p>
            </div>
          </div>
        </AppContainer>
      </div>
    </Variant>
  </Story>
</template>
