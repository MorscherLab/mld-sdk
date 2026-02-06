<script setup>
import MoleculeInputDemo from '../.vitepress/showcase/MoleculeInputDemo.vue'
</script>

# MoleculeInput

Chemical structure sketcher using JSME (JavaScript Molecular Editor) for drawing and editing molecular structures.

## Demo

<ClientOnly>
  <MoleculeInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `MoleculeData` | `undefined` | Molecule data containing SMILES and molfile (v-model) |
| `disabled` | `boolean` | `false` | Disable interaction with the editor |
| `readonly` | `boolean` | `false` | Display in readonly mode (no editor UI) |
| `height` | `number` | `300` | Height of the editor in pixels |
| `showSmiles` | `boolean` | `true` | Show SMILES string below the editor |
| `placeholder` | `string` | `'Draw a chemical structure'` | Placeholder text when no structure |
| `error` | `boolean` | `false` | Show error state styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `MoleculeData \| undefined` | Emitted when molecule structure changes |
| `error` | `string` | Emitted when editor encounters an error |

## Types

```typescript
interface MoleculeData {
  smiles: string   // Simplified molecular-input-line-entry system
  molfile: string  // MDL molfile format for structure
}
```

## Usage

```vue
<MoleculeInput
  v-model="moleculeData"
  :height="300"
  show-smiles
  @error="handleError"
/>
```
