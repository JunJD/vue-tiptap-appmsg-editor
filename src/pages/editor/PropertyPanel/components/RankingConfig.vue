<template>
  <base-config :node="node">
    <template #specific-props>
      <div class="specific-props">
        <!-- 数据配置 -->
        <div class="form-item">
          <label>数据源</label>
          <el-input
            v-model="data"
            type="textarea"
            :rows="4"
            placeholder="请输入JSON数据"
          />
        </div>
        
        <!-- 列配置 -->
        <div class="form-item">
          <label>列配置</label>
          <el-input
            v-model="columns"
            type="textarea"
            :rows="4"
            placeholder="请输入列配置"
          />
        </div>

        <!-- 模板配置 -->
        <div class="form-item">
          <label>展示模板</label>
          <el-input 
            v-model="template" 
            placeholder="例如: ${index}. ${name}: ${score}"
          />
          <div class="help-text">
            <div>可用变量:</div>
            <div>${index} - 序号</div>
            <div>${columnName} - 对应列的值</div>
          </div>
        </div>

        <!-- 自动滚动配置 -->
        <div class="form-item">
          <el-switch
            v-model="autoScroll"
            active-text="启用自动滚动"
          />
        </div>
        
        <div class="form-item" v-if="autoScroll">
          <label>滚动间隔(ms)</label>
          <el-input-number
            v-model="scrollInterval"
            :min="1000"
            :step="500"
            :max="10000"
          />
        </div>
      </div>
    </template>
  </base-config>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseConfig from './BaseConfig.vue'

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

// 使用 ref 管理表单值
const data = ref(JSON.stringify(props.node.attrs.data || [], null, 2))
const columns = ref(JSON.stringify(props.node.attrs.columns || [], null, 2))
const template = ref(props.node.attrs.template || '${index}. ${name}: ${score}')
const autoScroll = ref(props.node.attrs.autoScroll)
const scrollInterval = ref(props.node.attrs.scrollInterval || 3000)

// 监听值变化并更新节点属性
watch([data, columns, template, autoScroll, scrollInterval], () => {
  try {
    props.updateAttributes({
      data: JSON.parse(data.value),
      columns: JSON.parse(columns.value),
      template: template.value,
      autoScroll: autoScroll.value,
      scrollInterval: scrollInterval.value
    })
  } catch (e) {
    console.error('数据格式错误:', e)
  }
}, { deep: true })

// 监听节点属性变化
watch(() => props.node.attrs, (newAttrs) => {
  data.value = JSON.stringify(newAttrs.data || [], null, 2)
  columns.value = JSON.stringify(newAttrs.columns || [], null, 2)
  template.value = newAttrs.template || '${index}. ${name}: ${score}'
  autoScroll.value = newAttrs.autoScroll
  scrollInterval.value = newAttrs.scrollInterval || 3000
}, { immediate: true })
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #606266;
    font-size: 14px;
  }
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

:deep(.el-input-number) {
  width: 100%;
}
</style> 