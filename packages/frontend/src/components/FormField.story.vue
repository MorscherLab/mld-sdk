<script setup lang="ts">
import FormField from './FormField.vue'
</script>

<template>
  <Story title="Layout/FormField">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <FormField
            :label="state.label"
            :error="state.showError ? state.error : undefined"
            :hint="state.showHint ? state.hint : undefined"
            :required="state.required"
            :html-for="state.htmlFor"
          >
            <input
              :id="state.htmlFor"
              type="text"
              placeholder="Enter value..."
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
            />
          </FormField>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstCheckbox v-model="state.required" title="Required" />
        <HstCheckbox v-model="state.showError" title="Show Error" />
        <HstText v-model="state.error" title="Error Message" />
        <HstCheckbox v-model="state.showHint" title="Show Hint" />
        <HstText v-model="state.hint" title="Hint Text" />
        <HstText v-model="state.htmlFor" title="HTML For" />
      </template>
    </Variant>

    <Variant title="With Label">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Sample Name" html-for="sample-name">
          <input
            id="sample-name"
            type="text"
            placeholder="e.g., SAMPLE-001"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
      </div>
    </Variant>

    <Variant title="Required Field">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Experiment ID" :required="true" html-for="exp-id">
          <input
            id="exp-id"
            type="text"
            placeholder="Required field"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
      </div>
    </Variant>

    <Variant title="With Hint">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Concentration" hint="Enter value in micromolar (uM)" html-for="conc">
          <input
            id="conc"
            type="number"
            placeholder="0.00"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
      </div>
    </Variant>

    <Variant title="With Error">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Plate Barcode" error="Barcode format is invalid. Expected: PLT-XXXX-XXXX" html-for="barcode">
          <input
            id="barcode"
            type="text"
            value="invalid"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ef4444; border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
      </div>
    </Variant>

    <Variant title="Form Example">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <FormField label="Experiment Name" :required="true" html-for="form-name">
          <input
            id="form-name"
            type="text"
            placeholder="Enter experiment name"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
        <FormField label="Description" hint="Optional description for this experiment" html-for="form-desc">
          <textarea
            id="form-desc"
            placeholder="Describe the experiment..."
            rows="3"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); resize: vertical; box-sizing: border-box;"
          />
        </FormField>
        <FormField label="Plate Count" :required="true" error="Must be between 1 and 50" html-for="form-count">
          <input
            id="form-count"
            type="number"
            value="100"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ef4444; border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
          />
        </FormField>
      </div>
    </Variant>
  </Story>
</template>
