<script setup>
import { FloatingMenu } from "@tiptap/vue-3";
import { ref, computed, unref } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { Setting } from "@element-plus/icons-vue";
import { getCurrentNodeOfType } from '../extension/custom-focus'
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
    default: ['section', 'image']
  },
  getMenuList: {
    type: Function,
    required: true,
    default: () => ([])
  }
});

// 获取当前节点类型和菜单列表
const currentNodeInfo = computed(() => {
  return getCurrentNodeOfType(props.editor.state, props.nodeTypes)
})

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

// 处理菜单项点击
const handleCommand = (command) => {
  console.log('command',command);
  const item = renderMenuList.value.find(item => item.key === command);
  if (item) {
    item.action(props.editor, unref(currentNodeInfo));
  }
};

const shouldShowMenu = ({ editor, view, state, oldState }) => {
  // $from 和 $to 是 ProseMirror 的 ResolvedPos 对象
  // 它们包含了当前选区的起始和结束位置的详细信息
  const { $from, $to } = state.selection;
  
  // depth 为 0 表示在文档根节点，此时不显示菜单
  if ($from.depth === 0 || $to.depth === 0) return false;
  
  // 从当前节点开始向上遍历文档树
  // depth 表示当前节点的深度，每个父节点 depth 减 1
  let depth = $from.depth;
  while (depth > 0) {
    // node() 方法返回指定深度的节点
    const node = $from.node(depth);
    // 检查节点类型是否在允许的类型列表中
    if (props.nodeTypes.includes(node.type.name)) {
      return true;
    }
    depth--;
  }
  return false;
};

const tippyOptions = {
  appendTo: 'parent',
  placement: 'right-start',
  fixed: true,
  offset: [0, 0],
  getReferenceClientRect: () => {
    const { state, view } = props.editor;
    const { $from } = state.selection;
    let depth = $from.depth;
    let targetPos = null;
    
    while (depth > 0) {
      const node = $from.node(depth);
      if (props.nodeTypes.includes(node.type.name)) {
        targetPos = $from.before(depth);
        break;
      }
      depth--;
    }
    
    if (targetPos === null) return null;
    
    const nodeDOM = view.nodeDOM(targetPos);
    const editorView = view.dom.getBoundingClientRect();
    
    if (nodeDOM) {
      const nodeBounds = nodeDOM.getBoundingClientRect();
      const buttonWidth = 24;
      const right = editorView.right - 12;
      
      return {
        width: 0,
        height: 0,
        top: nodeBounds.top - 12,
        bottom: nodeBounds.top,
        left: right - (buttonWidth / 2),
        right: right - (buttonWidth / 2),
      };
    }
    return null;
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
    <el-dropdown 
      trigger="click" 
      @command="handleCommand"
    >
      <span class="el-dropdown-link">
        <el-icon class="el-icon--center">
          <el-icon size="16"><Setting /></el-icon>
        </el-icon>
      </span>
      
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in renderMenuList"
            :key="item.key"
            :command="item.key"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </floating-menu> 
</template>

<style lang="less" scoped>
.section-floating-menu {
  display: flex;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  position: fixed;
  
  .el-dropdown-link {
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    background: var(--el-bg-color);
    cursor: pointer;
    color: var(--el-text-color-regular);
    font-size: var(--el-font-size-base);
    width: 24px;
    height: 24px;
    justify-content: center;
    padding: 4px;
    
    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}

// 确保下拉菜单在编辑器内部正确显示
:deep(.el-dropdown__popper) {
  z-index: 30000; // 设置一个较高的 z-index
}
</style> 