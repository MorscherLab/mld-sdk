<script setup lang="ts">
import TimePicker from './TimePicker.vue'

function initState() {
  return {
    modelValue: '09:00' as string | undefined,
    placeholder: 'Select time',
    disabled: false,
    error: false,
    size: 'md' as const,
    step: 15,
    format: '24h' as const,
    clearable: false,
  }
}
</script>

<template>
  <Story title="Scheduling/TimePicker">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 300px;">
          <TimePicker
            v-model="state.modelValue"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :step="state.step"
            :format="state.format"
            :clearable="state.clearable"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.modelValue" title="Value (HH:mm)" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
        <HstSlider v-model="state.step" title="Step (minutes)" :min="5" :max="60" :step="5" />
        <HstSelect
          v-model="state.format"
          title="Format"
          :options="[
            { value: '24h', label: '24-hour' },
            { value: '12h', label: '12-hour' },
          ]"
        />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
      </template>
    </Variant>

    <Variant title="12-Hour Format">
      <div style="padding: 2rem; max-width: 300px;">
        <TimePicker model-value="14:30" format="12h" />
      </div>
    </Variant>

    <Variant title="With Min/Max">
      <div style="padding: 2rem; max-width: 300px;">
        <TimePicker
          model-value="10:00"
          min="08:00"
          max="18:00"
        />
      </div>
    </Variant>

    <Variant title="30-Minute Steps">
      <div style="padding: 2rem; max-width: 300px;">
        <TimePicker model-value="09:30" :step="30" />
      </div>
    </Variant>

    <Variant title="Clearable">
      <div style="padding: 2rem; max-width: 300px;">
        <TimePicker model-value="15:00" clearable />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 300px;">
        <TimePicker model-value="09:00" disabled />
      </div>
    </Variant>
  </Story>
</template>
