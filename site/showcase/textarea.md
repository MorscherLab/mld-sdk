<script setup>
import TextareaDemo from '../.vitepress/showcase/TextareaDemo.vue'
</script>

# BaseTextarea

A multi-line text input component with resize options and size variants.

## Demo

<ClientOnly>
  <TextareaDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Textarea value (v-model) |
| `placeholder` | `string` | - | Placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Textarea size |
| `rows` | `number` | `3` | Number of visible rows |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize behavior |
| `disabled` | `boolean` | `false` | Disable the textarea |
| `readonly` | `boolean` | `false` | Make textarea read-only |
| `error` | `boolean` | `false` | Show error state styling |
| `maxlength` | `number` | - | Maximum character length |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the textarea value changes |

## Usage

```vue
<BaseTextarea
  v-model="message"
  placeholder="Enter your message..."
  :rows="5"
  resize="vertical"
/>
```
