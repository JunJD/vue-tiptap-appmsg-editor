<template>
  <base-config :node="node">
    <template #common-props>
      <div class="common-props">
        <color-picker v-model="node.color" />
        <font-size-selector v-model="node.fontSize" />
        <alignment-selector v-model="node.alignment" />
      </div>
    </template>
    
    <template #specific-props>
      <div class="specific-props">
        <line-height-input v-model="node.lineHeight" />
        <letter-spacing-input v-model="node.letterSpacing" />
      </div>
    </template>
  </base-config>
</template>

<script setup>
import BaseConfig from './BaseConfig.vue'

defineProps({
  node: {
    type: Object,
    required: true
  }
})
</script> 