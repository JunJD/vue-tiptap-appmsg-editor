<template>
  <div class="node-pane">
    <div class="node-list">
      <div class="node-item" @click="insertSection">
        <div class="node-preview">
          <div class="section-preview"></div>
        </div>
        <div class="node-name">段落容器</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { editor } from "@/pages/editor/editor.js";

const insertSection = () => {
  editor.commands.insertSection()
}
</script>

<style lang="scss" scoped>
.node-pane {
  padding: 16px;
  
  .node-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .node-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 4px;
    
    &:hover {
      background-color: #f5f6f7;
      .node-preview {
        border-color: #07c160;
      }
    }
  }

  .node-preview {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    border: 1px solid #dcdee0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    .section-preview {
      width: 80%;
      height: 60%;
      background: #f5f6f7;
      border-radius: 2px;
    }
  }

  .node-name {
    font-size: 14px;
    color: #1d2129;
    text-align: left;
  }
}
</style> 