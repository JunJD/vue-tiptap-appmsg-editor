<script setup>
import { Editor, FloatingMenu } from "@tiptap/vue-3";

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  // 要检查的节点类型
  nodeType: {
    type: String,
    required: true
  },
  // 菜单位置配置
  position: {
    type: Object,
    default: () => ({
      placement: 'left-start',
      offset: [0, 70],
    })
  },
  // 自定义显示逻辑
  shouldShow: {
    type: Function,
    default: null
  },
  // 自定义获取参考元素的方法
  getReferenceElement: {
    type: Function,
    default: null
  }
});

// 默认的显示逻辑
const defaultShouldShow = ({ editor, view, state, oldState }) => {
  const { $from, $to } = state.selection;
  
  if ($from.depth === 0 || $to.depth === 0) return false;
  
  let depth = $from.depth;
  while (depth > 0) {
    const node = $from.node(depth);
    if (node.type.name === props.nodeType) {
      return true;
    }
    depth--;
  }
  return false;
};

// 默认的获取参考元素方法
const defaultGetReferenceElement = () => {
  const element = document.querySelector(`.ProseMirror ${props.nodeType}`);
  if (element) {
    const rect = element.getBoundingClientRect();
    return {
      width: 0,
      height: 0,
      top: rect.top,
      bottom: rect.top,
      left: rect.left,
      right: rect.left,
    };
  }
  return null;
};

const tippyOptions = {
  appendTo: 'parent',
  placement: props.position.placement,
  fixed: true,
  offset: props.position.offset,
  getReferenceClientRect: props.getReferenceElement || defaultGetReferenceElement,
};

// 使用自定义或默认的显示逻辑
const showMenu = props.shouldShow || defaultShouldShow;
</script>

<template>
  <floating-menu 
    :editor="editor" 
    class="floating-toolbar"
    :tippy-options="tippyOptions"
    :should-show="showMenu"
  >
    <div class="toolbar-buttons">
      <slot></slot>
    </div>
  </floating-menu>
</template>

<style lang="less" scoped>
.floating-toolbar {
  display: flex;
  background-color: #fff;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  transform: translateX(-10px);
  opacity: 0;
  transition: all 0.3s ease;
  
  &[data-show] {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toolbar-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    :deep(button) {
      padding: 5px 10px;
      border: 1px solid #e7e7e8;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      white-space: nowrap;
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style> 