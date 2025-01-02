<template>
  <node-view-wrapper class="op-form-wrapper">
    <div class="form-fields">
      <div 
        v-for="field in node.attrs.fields" 
        :key="field.id" 
        class="input-item"
      >
        <component 
          :is="getFieldComponent(field.type)"
          v-bind="getFieldProps(field)"
          :model-value="formData[field.name]"
          @update:model-value="val => updateFieldValue(field.name, val)"
        >
          <template #prefix>
            <div 
              class="field-label"
              contenteditable="true"
              @input="e => updateFieldLabel(field.id, e.target.textContent)"
              v-text="field.label"
            />
          </template>
        </component>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { ref } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  updateAttributes: {
    type: Function,
    required: true
  }
})

const formData = ref(props.node.attrs.formData || {})

const getFieldComponent = (type) => {
  const componentMap = {
    'input': 'el-input',
    'textarea': 'el-input',
    'amount': 'el-input'
  }
  return componentMap[type] || 'el-input'
}

const getFieldProps = (field) => {
  const commonProps = {
    placeholder: field.placeholder,
    clearable: true
  }

  switch (field.type) {
    case 'textarea':
      return {
        ...commonProps,
        type: 'textarea',
        rows: 4,
        resize: 'none',
        autosize: { minRows: 4, maxRows: 6 }
      }
    case 'amount':
      return {
        ...commonProps,
        readonly: field.readonly,
        suffix: field.suffix
      }
    default:
      return commonProps
  }
}

const updateFieldValue = (name, value) => {
  formData.value[name] = value
  props.updateAttributes({
    formData: { ...formData.value }
  })
}

const updateFieldLabel = (fieldId, newLabel) => {
  const fields = [...props.node.attrs.fields]
  const fieldIndex = fields.findIndex(f => f.id === fieldId)
  if (fieldIndex > -1) {
    fields[fieldIndex] = {
      ...fields[fieldIndex],
      label: newLabel
    }
    props.updateAttributes({ fields })
  }
}
</script>

<style lang="less" scoped>
.op-form-wrapper {
  padding: 0;

  .form-fields {
    display: flex;
    flex-direction: column;

    .input-item {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 12px 20px;
      margin-top: 20px;
      display: flex;
      align-items: center;

      &:first-child {
        margin-top: 0;
      }

      :deep(.el-input__wrapper) {
        box-shadow: none;
        background: none;
        padding: 0;
      }

      :deep(.el-input__prefix) {
        margin-right: 12px;
        
        .field-label {
          font-size: 13px;
          color: #999;
          white-space: nowrap;
          min-width: 60px;
          outline: none;
          padding: 2px 4px;
          user-select: none;
          
          &:hover {
            background: rgba(0, 0, 0, 0.02);
          }
          
          &:focus {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2px;
            user-select: text;
          }
        }
      }

      :deep(.el-input__inner) {
        height: 24px;
        border: none;
        padding: 0;
        font-size: 14px;
        color: #333;

        &::placeholder {
          color: #999;
          font-size: 13px;
        }
      }

      :deep(.el-input__suffix) {
        color: #999;
      }

      :deep(.el-textarea__inner) {
        border: none;
        padding: 0;
        background: none;
        font-size: 14px;
        color: #333;
        line-height: 1.5;

        &::placeholder {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
}
</style> 