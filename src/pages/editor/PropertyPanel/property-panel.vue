<template>
  <div class="property-panel">
    <div class="panel-header">
      属性设置
    </div>
    <div class="panel-content">
      <component
        v-if="currentConfig"
        :is="currentConfig.component"
        :node="activeNode.node"
      />
      <div v-else class="no-selection">
        请选择一个节点进行编辑
      </div>
    </div>
  </div>
</template>

<script setup>
import { unref, computed } from 'vue'
import { usePropertySetting } from './PropertySettingProvider' 
import { getId, getTypeName } from './utils'
import { nodeConfigs } from './configs'

const { activeNode } = usePropertySetting()

const currentConfig = computed(() => {
  const node = unref(activeNode)?.node
  if (!node) return null
  
  // 将组件名称映射到实际组件
  const config = nodeConfigs[getTypeName(node)]
  console.log(config, 'config')
  if (config) {
    return {
      ...config,
      component: config.component // 这里可以根据 config.component 动态映射
    }
  }
  return null
})
</script>

<style lang="less" scoped>
.property-panel {
  position: fixed;
  top: 90px;
  right: 0;
  width: 20vw;
  min-width: 280px;
  height: calc(100vh - 90px);
  background: #fff;
  border-left: 1px solid #e7e7e8;
  
  .panel-header {
    height: 48px;
    line-height: 48px;
    padding: 0 16px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #e7e7e8;
  }

  .panel-content {
    padding: 16px;
  }
}
</style> 