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

      <div class="node-item" @click="insertOpForm">
        <div class="node-preview">
          <div class="form-preview">
            <div class="form-line" v-for="i in 3" :key="i">
              <div class="form-label"></div>
              <div class="form-input"></div>
            </div>
          </div>
        </div>
        <div class="node-name">表单</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { editor } from "@/pages/editor/editor.js";
import { useScreenDetail } from "@/composables/useScreen";
const { screenDetail, addViewNode } = useScreenDetail()
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
      { name: '郑十', score: 65 },
      { name: '赵一', score: 60 },
      { name: '孙二', score: 55 },
      { name: '周三', score: 50 },
      { name: '吴四', score: 45 },
      { name: '郑五', score: 40 },
      { name: '赵六', score: 35 },
      { name: '孙七', score: 30 },
      { name: '周八', score: 25 },
      { name: '吴九', score: 20 },
      { name: '郑十', score: 15 },
      { name: '赵一', score: 10 },
      { name: '孙二', score: 5 },
      { name: '周三', score: 0 },
    ],
    columns: [
      { field: 'name', title: '姓名' },
      { field: 'score', title: '分数' }
    ]
  })
  addViewNode({
    type: 'rankingList',
    data: {
      id: 'rankingList_1',
      title: '排行榜'
    }
  })
}

const insertOpForm = () => {
  editor.commands.setOpForm({
    fields: [
      {
        id: 'field_1',
        type: 'input',
        name: 'name',
        label: '姓名:',
        required: true,
        props: {
          placeholder: '请输入姓名'
        }
      },
      {
        id: 'field_2',
        type: 'select',
        name: 'gender',
        label: '性别:',
        required: true,
        props: {
          placeholder: '请选择性别',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]
        }
      },
      {
        id: 'field_3',
        type: 'input',
        name: 'phone',
        label: '手机号:',
        required: true,
        props: {
          placeholder: '请输入手机号'
        }
      }
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

      &:nth-child(1) {
        width: 100%;
      }

      &:nth-child(2) {
        width: 80%;
      }

      &:nth-child(3) {
        width: 60%;
      }
    }
  }

  .form-preview {
    width: 80%;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .form-line {
      display: flex;
      align-items: center;
      gap: 8px;

      .form-label {
        width: 30%;
        height: 4px;
        background: #f5f6f7;
        border-radius: 2px;
      }

      .form-input {
        flex: 1;
        height: 4px;
        background: #f5f6f7;
        border-radius: 2px;
      }
    }
  }
}
</style>