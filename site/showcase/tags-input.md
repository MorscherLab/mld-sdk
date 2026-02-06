<script setup>
import TagsInputDemo from '../.vitepress/showcase/TagsInputDemo.vue'
</script>

# TagsInput

A component for entering multiple tags or keywords with add/remove functionality. Tags are added by pressing Enter or comma.

## Demo

<ClientOnly>
  <TagsInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | `[]` | Array of tags (v-model) |
| `placeholder` | `string` | - | Placeholder text (shown when empty) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `maxTags` | `number` | - | Maximum number of tags allowed |
| `allowDuplicates` | `boolean` | `false` | Allow duplicate tags |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `boolean` | `false` | Show error state styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[]` | Emitted when tags are added or removed |

## Usage

```vue
<TagsInput
  v-model="tags"
  placeholder="Add tags..."
  :max-tags="10"
/>
```
