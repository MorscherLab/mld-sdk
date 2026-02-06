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
  <!-- Basic Label -->
  <DemoSection title="With Label">
    <div class="max-w-md">
      <FormField label="Username">
        <BaseInput v-model="username" placeholder="Enter username" />
      </FormField>
    </div>
  </DemoSection>

  <!-- Required Field -->
  <DemoSection title="Required Field">
    <div class="max-w-md">
      <FormField label="Email Address" required>
        <BaseInput v-model="email" type="email" placeholder="Enter email" />
      </FormField>
    </div>
  </DemoSection>

  <!-- With Hint -->
  <DemoSection title="With Hint">
    <div class="max-w-md">
      <FormField label="Password" hint="Must be at least 8 characters">
        <BaseInput v-model="password" type="password" placeholder="Enter password" />
      </FormField>
    </div>
  </DemoSection>

  <!-- With Error -->
  <DemoSection title="With Error">
    <div class="max-w-md">
      <FormField label="Email" error="Please enter a valid email address">
        <BaseInput model-value="invalid-email" type="email" error />
      </FormField>
    </div>
  </DemoSection>

  <!-- With Select -->
  <DemoSection title="With Select">
    <div class="max-w-md">
      <FormField label="Country" hint="Select your country of residence">
        <BaseSelect v-model="country" :options="countryOptions" placeholder="Select country" />
      </FormField>
    </div>
  </DemoSection>

  <!-- Complete Form Example -->
  <DemoSection title="Complete Form Example">
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
  </DemoSection>
</template>
