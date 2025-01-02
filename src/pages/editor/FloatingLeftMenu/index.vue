<script setup>
import { FloatingMenu } from "@tiptap/vue-3";
import { computed, unref } from 'vue';
import { Setting } from "@element-plus/icons-vue";
import { customFocusPluginKey } from '../extension/custom-focus'
import { usePropertySetting } from '../PropertyPanel/PropertySettingProvider'

const { setActiveNode } = usePropertySetting()

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  nodeTypes: {
    type: Array,
    required: true,
    default: ['section', 'rankingList', 'opForm']
  },
  getMenuList: {
    type: Function,
    required: true,
    default: () => ([])
  }
});

const currentNodeInfo = ref(null)

const defaultMenuList = [
  {
    label: '编辑',
    key: 'edit',
    action: (editor, nodeInfo) => {
      console.log(nodeInfo, 'nodeInfo')
      setActiveNode(nodeInfo)
    }
  }
]

// 根据当前节点获取菜单列表
const menuList = computed(() => {
  if (!unref(currentNodeInfo)) return [];
  return (props.getMenuList(unref(currentNodeInfo)));
});

const renderMenuList = computed(() => {
  return [...menuList.value, ...defaultMenuList]
})

const handleMouseEnter = () => {
  currentNodeInfo.value = customFocusPluginKey.getState(props.editor.state)?.focusedNode || null
}

// 处理菜单项点击
const handleCommand = (command) => {
  const item = renderMenuList.value.find(item => item.key === command);
  if (item) {
    item.action(props.editor, unref(currentNodeInfo));
  }
};

const shouldShowMenu = ({ editor, view, state, oldState }) => {
  // 直接从插件状态获取焦点节点信息
  const focusedNode = customFocusPluginKey.getState(state)?.focusedNode
  if (!focusedNode) return false

  // 检查节点类型是否在允许的类型列表中
  return props.nodeTypes.includes(focusedNode.type)
}

const tippyOptions = {
  appendTo: 'parent',
  placement: 'right-start',
  fixed: true,
  offset: [0, 0],
  getReferenceClientRect: () => {
    const { view } = props.editor
    const focusedNode = customFocusPluginKey.getState(props.editor.state)?.focusedNode
    if (!focusedNode) return null
    
    const nodeDOM = view.nodeDOM(focusedNode.pos)
    const editorView = view.dom.getBoundingClientRect()
    
    if (nodeDOM) {
      const nodeBounds = nodeDOM.getBoundingClientRect()
      const buttonWidth = 24
      const right = editorView.right - 12
      
      return {
        width: 0,
        height: 0,
        top: nodeBounds.top - 12,
        bottom: nodeBounds.top,
        left: right - (buttonWidth / 2),
        right: right - (buttonWidth / 2),
      }
    }
    return null
  },
};
</script>

<template>
  <floating-menu 
    :editor="editor" 
    class="section-floating-menu"
    :tippy-options="tippyOptions"
    :should-show="shouldShowMenu"
  >
    <el-popover
      placement="left-start"
      :width="120"
      :show-arrow="false"
      popper-class="section-menu-popover"
    >
      <template #reference>
        <el-button class="menu-trigger" size="small" @mouseenter="handleMouseEnter">
          <el-icon><Setting /></el-icon>
        </el-button>
      </template>
      
      <div class="menu-list">
        <div
          v-for="item in renderMenuList"
          :key="item.key"
          class="menu-item"
          @click.stop.capture.prevent="handleCommand(item.key)"
        >
          {{ item.label }}
        </div>
      </div>
    </el-popover>
  </floating-menu> 
</template>

<style lang="less">
// 移除 scoped，让样式可以作用到 popover
.section-menu-popover {
  padding: 4px 0 !important;
  
  .menu-list {
    .menu-item {
      padding: 8px 12px;
      cursor: pointer;
      color: var(--el-text-color-regular);
      font-size: var(--el-font-size-base);
      transition: background-color 0.3s;
      
      &:hover {
        background-color: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }
    }
  }
}

// 确保弹出层在编辑器内部正确显示
.el-popper.section-menu-popover {
  z-index: 30000;
}
</style>

<style lang="less" scoped>
.section-floating-menu {
  display: flex;
  position: fixed;
  
  .menu-trigger {
    width: 24px;
    height: 24px;
    padding: 4px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    
    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style> 