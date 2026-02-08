<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
}

withDefaults(defineProps<Props>(), {
  separator: '/',
})

const emit = defineEmits<{
  navigate: [item: BreadcrumbItem]
}>()

function handleClick(item: BreadcrumbItem) {
  if (!item.href) {
    emit('navigate', item)
  }
}
</script>

<template>
  <nav class="mld-breadcrumb" aria-label="Breadcrumb">
    <ol class="mld-breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="mld-breadcrumb__item"
      >
        <slot name="item" :item="item" :index="index" :is-last="index === items.length - 1">
          <a
            v-if="item.href && index !== items.length - 1"
            :href="item.href"
            class="mld-breadcrumb__link"
          >
            {{ item.label }}
          </a>
          <button
            v-else-if="index !== items.length - 1"
            class="mld-breadcrumb__link"
            @click="handleClick(item)"
          >
            {{ item.label }}
          </button>
          <span
            v-else
            class="mld-breadcrumb__current"
            aria-current="page"
          >
            {{ item.label }}
          </span>
        </slot>
        <span
          v-if="index !== items.length - 1"
          class="mld-breadcrumb__separator"
          aria-hidden="true"
        >
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style>
@import '../styles/components/breadcrumb.css';
</style>
