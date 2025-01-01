<template>
  <node-view-wrapper class="ranking-list" :class="{ 'auto-scroll': node.attrs.autoScroll }" @click="handleClick">
    <div class="ranking-list-content" ref="listContent">
      <!-- 原始列表 -->
      <div class="ranking-items original" contenteditable="false">
        <template v-for="(item, index) in node.attrs.data" :key="index">
          <div class="ranking-item">
            <div class="item-content">
              {{ renderItemContent(item, index) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { editor } from '../editor'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
  },
  getPos: {
    type: Function,
    required: true,
  },
})

const listContent = ref(null)
let scrollInterval = null

// 渲染列表项内容
const renderItemContent = (item, index) => {
  if (!item) return ''
  
  const template = props.node.attrs.template
  return template.replace(/\${(\w+)}/g, (match, key) => {
    if (key === 'index') return index + 1
    return item[key] || match
  })
}

const startScroll = () => {
  if (!props.node.attrs.autoScroll) return
  
  const step = 1 // 每次滚动的像素数
  const speed = props.node.attrs.scrollInterval || 50 // 滚动间隔
  
  scrollInterval = setInterval(() => {
    const container = listContent.value
    if (!container) return
    
    const itemHeight = container.querySelector('.ranking-item')?.offsetHeight || 0
    const containerHeight = container.offsetHeight

    if (container.scrollTop >= itemHeight * props.node.attrs.data.length) {
      // 当滚动到原始列表底部时，平滑重置到顶部
      container.scrollTop = 0
    } else {
      container.scrollTop += step
    }
  }, speed)
}

const stopScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
}

watch(() => props.node.attrs.autoScroll, (newVal) => {
  if (newVal) {
    startScroll()
  } else {
    stopScroll()
    if (listContent.value) {
      listContent.value.scrollTop = 0
    }
  }
})

onMounted(() => {
  if (props.node.attrs.autoScroll) {
    startScroll()
  }
})

onUnmounted(() => {
  stopScroll()
})

// 处理点击事件
const handleClick = () => {
  const pos = props.getPos()
  console.log(pos, 'pos')
//   if (typeof pos !== 'number') return
  
//   // 使用 TextSelection 而不是 NodeSelection
//   const { state, dispatch } = editor.view
//   const selection = state.selection.constructor.near(state.doc.resolve(pos))
//   dispatch(state.tr.setSelection(selection))
  
//   editor.view.focus()
}
</script>

<style lang="less" scoped>
.ranking-list {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  background: #fff;
  cursor: pointer; // 添加指针样式表明可点击
  
  .ranking-list-content {
    max-height: 300px;
    overflow-y: auto;
    position: relative;
    
    .ranking-items {
      display: flex;
      flex-direction: column;
      
      &.clone {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        pointer-events: none;
        background: #fff;
      }

      .ranking-item {
        padding: 8px;
        
        .item-content {
          min-height: 24px;
          user-select: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    
    // 隐藏滚动条但保持功能
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    
    // 平滑滚动
    scroll-behavior: smooth;
  }
  
  &.auto-scroll {
    .ranking-list-content {
      // 禁止用户手动滚动
      pointer-events: none;
    }
  }
}
</style> 