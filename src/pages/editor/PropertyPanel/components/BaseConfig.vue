<template>
  <div class="base-config">
    <slot name="common-props"></slot>
    <slot name="specific-props"></slot>
  </div>
</template>

<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  }
})
</script> 