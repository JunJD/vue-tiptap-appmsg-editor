import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import OpFormView from './OpFormView.vue'

export const OpForm = Node.create({
  name: 'opForm',

  group: 'block',
  content: '',
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'op-form',
      },
    }
  },

  addAttributes() {
    return {
      fields: {
        default: [
          {
            id: 'field_1',
            type: 'amount',
            name: 'amount',
            label: '金额:',
            placeholder: '金额',
            required: true,
            readonly: false,
            suffix: '元',
            content: '金额:'
          },
          {
            id: 'field_2',
            type: 'input',
            name: 'name',
            label: '姓名:',
            placeholder: '姓名',
            required: true
          },
          {
            id: 'field_3',
            type: 'input',
            name: 'phone',
            label: '联系方式:',
            placeholder: '联系方式',
            required: true
          },
          {
            id: 'field_4',
            type: 'textarea',
            name: 'wish',
            label: '祈愿',
            placeholder: '祈愿',
            required: true
          }
        ],
        parseHTML: element => {
          return JSON.parse(element.getAttribute('fields') || '[]')
        }
      },
      formData: {
        default: {},
        parseHTML: element => {
          return JSON.parse(element.getAttribute('form-data') || '{}')
        }
      }
    }
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="op-form"]',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(
      { 
        'data-type': 'op-form',
        'data-node-view-wrapper': ''
      },
      this.options.HTMLAttributes,
      {
        'id': HTMLAttributes.id,
        'data-node-id': HTMLAttributes.id
      },
      HTMLAttributes
    ), 0]
  },

  addCommands() {
    return {
      setOpForm: (attributes = {}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes
        })
      }
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(OpFormView)
  }
})