<script setup lang="ts">
import { ref } from 'vue'
import { FormField, BaseInput, BaseSelect, type SelectOption } from '@morscherlab/mld-sdk'

const username = ref('')
const email = ref('')
const password = ref('')
const country = ref('')

const countryOptions: SelectOption<string>[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">FormField</h1>
    <p class="text-text-secondary mb-8">
      A wrapper component that adds labels, hints, and error messages to form inputs.
    </p>

    <!-- Basic Label -->
    <div class="demo-section">
      <h3>With Label</h3>
      <div class="max-w-md">
        <FormField label="Username">
          <BaseInput v-model="username" placeholder="Enter username" />
        </FormField>
      </div>
    </div>

    <!-- Required Field -->
    <div class="demo-section">
      <h3>Required Field</h3>
      <div class="max-w-md">
        <FormField label="Email Address" required>
          <BaseInput v-model="email" type="email" placeholder="Enter email" />
        </FormField>
      </div>
    </div>

    <!-- With Hint -->
    <div class="demo-section">
      <h3>With Hint</h3>
      <div class="max-w-md">
        <FormField label="Password" hint="Must be at least 8 characters">
          <BaseInput v-model="password" type="password" placeholder="Enter password" />
        </FormField>
      </div>
    </div>

    <!-- With Error -->
    <div class="demo-section">
      <h3>With Error</h3>
      <div class="max-w-md">
        <FormField label="Email" error="Please enter a valid email address">
          <BaseInput model-value="invalid-email" type="email" error />
        </FormField>
      </div>
    </div>

    <!-- With Select -->
    <div class="demo-section">
      <h3>With Select</h3>
      <div class="max-w-md">
        <FormField label="Country" hint="Select your country of residence">
          <BaseSelect v-model="country" :options="countryOptions" placeholder="Select country" />
        </FormField>
      </div>
    </div>

    <!-- Complete Form Example -->
    <div class="demo-section">
      <h3>Complete Form Example</h3>
      <div class="max-w-md space-y-4">
        <FormField label="Full Name" required>
          <BaseInput placeholder="John Doe" />
        </FormField>

        <FormField label="Email" required hint="We'll never share your email">
          <BaseInput type="email" placeholder="john@example.com" />
        </FormField>

        <FormField label="Password" required hint="At least 8 characters">
          <BaseInput type="password" placeholder="Enter password" />
        </FormField>

        <FormField label="Country">
          <BaseSelect :options="countryOptions" placeholder="Select country" />
        </FormField>

        <FormField label="Bio" hint="Tell us about yourself (optional)">
          <BaseInput placeholder="A few words about you..." />
        </FormField>
      </div>
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
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Field label text</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Error message to display</td>
          </tr>
          <tr>
            <td><code>hint</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Hint text (hidden when error is shown)</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show required asterisk</td>
          </tr>
          <tr>
            <td><code>htmlFor</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>ID of the input for label association</td>
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
            <td>The form input element (BaseInput, BaseSelect, etc.)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;FormField
  label="Email"
  :error="emailError"
  hint="We'll never share your email"
  required
&gt;
  &lt;BaseInput
    v-model="email"
    type="email"
    :error="!!emailError"
  /&gt;
&lt;/FormField&gt;</pre>
    </div>
  </div>
</template>
