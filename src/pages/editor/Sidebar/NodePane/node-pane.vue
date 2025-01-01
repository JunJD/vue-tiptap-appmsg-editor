<template>
  <div class="node-pane">
    <div class="node-list">
      <div class="node-item" @click="insertSection">
        <div class="node-preview">
          <div class="section-preview"></div>
        </div>
        <div class="node-name">段落容器</div>
      </div>

      <div class="node-item" @click="insertRankingList">
        <div class="node-preview">
          <div class="ranking-preview">
            <div class="ranking-line" v-for="i in 3" :key="i"></div>
          </div>
        </div>
        <div class="node-name">排行榜</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { editor } from "@/pages/editor/editor.js";

const insertSection = () => {
  editor.commands.insertSection()
}

const insertRankingList = () => {
  editor.commands.setRankingList({
    data: [
      { name: '张三', score: 100 },
      { name: '李四', score: 95 },
      { name: '王五', score: 90 },
      { name: '赵六', score: 85 },
      { name: '孙七', score: 80 },
      { name: '周八', score: 75 },
      { name: '吴九', score: 70 },
      { name: '郑十', score: 65 }
    ],
    columns: [
      { field: 'name', title: '姓名' },
      { field: 'score', title: '分数' }
    ]
  })
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

  .ranking-preview {
    width: 80%;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .ranking-line {
      height: 4px;
      background: #f5f6f7;
      border-radius: 2px;
      
      &:nth-child(1) { width: 100%; }
      &:nth-child(2) { width: 80%; }
      &:nth-child(3) { width: 60%; }
    }
  }
}
</style> 