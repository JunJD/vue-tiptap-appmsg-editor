import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// 抽离获取当前节点信息的方法
export const getCurrentNodeOfType = (state, nodeTypes) => {
  const { $from } = state.selection
  let depth = $from.depth
  
  while (depth > 0) {
    const node = $from.node(depth)
    if (nodeTypes.includes(node.type.name)) {
      return {
        node,
        pos: $from.start(depth),
        type: node.type.name,
        depth
      }
    }
    depth--
  }
  return null
}

export const CustomFocus = Extension.create({
  name: 'customFocus',

  addOptions() {
    return {
      className: 'has-focus',
      allowedTags: [],
      mode: 'all',
    }
  },

  // 添加一个扩展方法，方便外部调用
  getCurrentNode() {
    return getCurrentNodeOfType(this.editor.state, this.options.allowedTags)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customFocus'),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor
            const { anchor } = selection
            const decorations = []

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, [])
            }

            // 处理 deepest 模式的最大层级
            let maxLevels = 0
            if (this.options.mode === 'deepest') {
              doc.descendants((node, pos) => {
                if (node.isText) {
                  return
                }

                const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1

                if (!isCurrent) {
                  return false
                }

                maxLevels += 1
              })
            }

            let currentLevel = 0

            // 遍历所有节点，找到当前选中的节点
            doc.descendants((node, pos) => {
              if (node.isText) {
                return false
              }

              const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1

              if (!isCurrent) {
                return false
              }

              currentLevel += 1

              // 检查节点类型是否在允许列表中
              const isAllowedTag = this.options.allowedTags.length === 0 || 
                                 this.options.allowedTags.includes(node.type.name)

              if (!isAllowedTag) {
                return false
              }

              const outOfScope = (this.options.mode === 'deepest' && maxLevels - currentLevel > 0)
                || (this.options.mode === 'shallowest' && currentLevel > 1)

              if (outOfScope) {
                return this.options.mode === 'deepest'
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className,
                }),
              )
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
}) 