<template>
  <div class="color-picker">
    <input
      type="color"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<style lang="less" scoped>
.color-picker {
  input {
    width: 100%;
    height: 32px;
    padding: 2px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }
  }
}
</style> 