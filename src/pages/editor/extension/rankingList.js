import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RankingListView from '../components/RankingListView.vue'

export const RankingList = Node.create({
  name: 'rankingList',
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'ranking-list',
      },
    }
  },

  group: 'block',
  content: '',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      data: {
        default: [],
        parseHTML: element => {
          return JSON.parse(element.getAttribute('data') || '[]')
        },
      },
      columns: {
        default: [],
        parseHTML: element => {
          return JSON.parse(element.getAttribute('columns') || '[]')
        },
      },
      template: {
        default: '${index}. ${name}: ${score}',
        parseHTML: element => element.getAttribute('template'),
      },
      autoScroll: {
        default: false,
        parseHTML: element => element.getAttribute('auto-scroll') === 'true',
      },
      scrollInterval: {
        default: 3000,
        parseHTML: element => parseInt(element.getAttribute('scroll-interval') || '3000'),
      }
    }
  },

  addCommands() {
    return {
      setRankingList: (attributes = {}) => ({ commands }) => {
        const defaultData = {
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
          ],
          template: '${index}. ${name}: ${score}',
          autoScroll: false,
          scrollInterval: 150
        }

        return commands.insertContent({
          type: this.name,
          attrs: { ...defaultData, ...attributes }
        })
      }
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(RankingListView)
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="ranking-list"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(
      { 
        'data-type': 'ranking-list',
        'data-node-view-wrapper': '',
      },
      this.options.HTMLAttributes,
      HTMLAttributes
    ), 0]
  },
})