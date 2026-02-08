<script setup lang="ts">
import { useChemicalFormula, type FormulaPart } from '../composables/useChemicalFormula'

interface Props {
  formula: string
  inline?: boolean
}

withDefaults(defineProps<Props>(), {
  inline: true,
})

const { renderFormulaParts } = useChemicalFormula()

function getParts(f: string): FormulaPart[] {
  return renderFormulaParts(f)
}
</script>

<template>
  <component
    :is="inline ? 'span' : 'div'"
    :class="['mld-chem-formula', !inline ? 'mld-chem-formula--block' : '']"
  >
    <template v-for="(part, i) in getParts(formula)" :key="i">
      <span v-if="part.type === 'element'" class="mld-chem-formula__element">{{ part.text }}</span>
      <span v-else-if="part.type === 'subscript'" class="mld-chem-formula__subscript">{{ part.text }}</span>
      <span v-else-if="part.type === 'superscript'" class="mld-chem-formula__superscript">{{ part.text }}</span>
      <span v-else-if="part.type === 'paren'" class="mld-chem-formula__paren">{{ part.text }}</span>
      <span v-else-if="part.type === 'dot'" class="mld-chem-formula__dot">{{ part.text }}</span>
      <span v-else-if="part.type === 'charge'" class="mld-chem-formula__charge">{{ part.text }}</span>
    </template>
  </component>
</template>

<style>
@import '../styles/components/chemical-formula.css';
</style>
