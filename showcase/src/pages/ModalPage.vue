<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseButton, FormField, BaseInput, type ModalSize } from '@morscherlab/mld-sdk'

const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const basicModal = ref(false)
const sizeModal = ref<ModalSize | null>(null)
const footerModal = ref(false)
const nonClosableModal = ref(false)
const formModal = ref(false)

const formName = ref('')
const formEmail = ref('')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseModal</h1>
    <p class="text-text-secondary mb-8">
      A modal dialog component with multiple sizes and customizable close behavior.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Modal</h3>
      <BaseButton @click="basicModal = true">Open Basic Modal</BaseButton>

      <BaseModal v-model="basicModal" title="Basic Modal">
        <p class="text-text-secondary">
          This is a basic modal with a title and close button.
          Click outside or press Escape to close.
        </p>
      </BaseModal>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Modal Sizes</h3>
      <div class="demo-grid">
        <BaseButton
          v-for="size in sizes"
          :key="size"
          variant="secondary"
          @click="sizeModal = size"
        >
          {{ size.toUpperCase() }}
        </BaseButton>
      </div>

      <BaseModal
        v-for="size in sizes"
        :key="size"
        v-model="sizeModal"
        :title="`Size: ${size.toUpperCase()}`"
        :size="size"
        @update:model-value="(val) => !val && (sizeModal = null)"
      >
        <template v-if="sizeModal === size">
          <p class="text-text-secondary mb-4">
            This modal has size <code class="text-mld-primary">{{ size }}</code>.
          </p>
          <div class="text-sm text-text-muted">
            <p>sm: max-w-sm (384px)</p>
            <p>md: max-w-md (448px)</p>
            <p>lg: max-w-lg (512px)</p>
            <p>xl: max-w-xl (576px)</p>
            <p>full: max-w-4xl (896px)</p>
          </div>
        </template>
      </BaseModal>
    </div>

    <!-- With Footer -->
    <div class="demo-section">
      <h3>With Footer Slot</h3>
      <BaseButton @click="footerModal = true">Open Modal with Footer</BaseButton>

      <BaseModal v-model="footerModal" title="Confirm Action" size="sm">
        <p class="text-text-secondary">
          Are you sure you want to proceed with this action?
          This cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <BaseButton variant="ghost" @click="footerModal = false">Cancel</BaseButton>
            <BaseButton variant="danger" @click="footerModal = false">Delete</BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>

    <!-- Form Modal -->
    <div class="demo-section">
      <h3>Form in Modal</h3>
      <BaseButton variant="cta" @click="formModal = true">Open Form Modal</BaseButton>

      <BaseModal v-model="formModal" title="Create New Item" size="md">
        <div class="space-y-4">
          <FormField label="Name" required>
            <BaseInput v-model="formName" placeholder="Enter name" />
          </FormField>
          <FormField label="Email" required hint="We'll send a confirmation to this address">
            <BaseInput v-model="formEmail" type="email" placeholder="Enter email" />
          </FormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <BaseButton variant="ghost" @click="formModal = false">Cancel</BaseButton>
            <BaseButton variant="primary" @click="formModal = false">Create</BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>

    <!-- Non-closable Modal -->
    <div class="demo-section">
      <h3>Non-closable Modal</h3>
      <p class="text-sm text-text-secondary mb-4">
        Modal that can only be closed via the action buttons
      </p>
      <BaseButton variant="secondary" @click="nonClosableModal = true">
        Open Non-closable Modal
      </BaseButton>

      <BaseModal
        v-model="nonClosableModal"
        title="Processing..."
        :closable="false"
        :close-on-overlay="false"
        :close-on-escape="false"
        size="sm"
      >
        <p class="text-text-secondary mb-4">
          This modal cannot be closed by clicking outside, pressing Escape,
          or the X button.
        </p>
        <BaseButton variant="primary" full-width @click="nonClosableModal = false">
          Close Modal
        </BaseButton>
      </BaseModal>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
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
          <tr>
            <td><code>modelValue</code></td>
            <td><code>boolean</code></td>
            <td>Required</td>
            <td>Modal visibility (v-model)</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Modal title</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>ModalSize</code></td>
            <td><code>'md'</code></td>
            <td>Modal width</td>
          </tr>
          <tr>
            <td><code>closable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show close button</td>
          </tr>
          <tr>
            <td><code>closeOnOverlay</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Close when clicking overlay</td>
          </tr>
          <tr>
            <td><code>closeOnEscape</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Close when pressing Escape</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>boolean</code></td>
            <td>Emitted when visibility changes</td>
          </tr>
          <tr>
            <td><code>close</code></td>
            <td>-</td>
            <td>Emitted when modal is closed</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slots Table -->
    <div class="demo-section">
      <h3>Slots</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code></td>
            <td>Modal body content</td>
          </tr>
          <tr>
            <td><code>footer</code></td>
            <td>Footer with action buttons</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">const isOpen = ref(false)

&lt;BaseButton @click="isOpen = true"&gt;Open&lt;/BaseButton&gt;

&lt;BaseModal v-model="isOpen" title="Confirm" size="sm"&gt;
  &lt;p&gt;Are you sure?&lt;/p&gt;

  &lt;template #footer&gt;
    &lt;BaseButton variant="ghost" @click="isOpen = false"&gt;
      Cancel
    &lt;/BaseButton&gt;
    &lt;BaseButton variant="danger" @click="handleConfirm"&gt;
      Delete
    &lt;/BaseButton&gt;
  &lt;/template&gt;
&lt;/BaseModal&gt;</pre>
    </div>
  </div>
</template>
