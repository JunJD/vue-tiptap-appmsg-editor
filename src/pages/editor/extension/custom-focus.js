import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const customFocusPluginKey = new PluginKey('customFocus')

export const CustomFocus = Extension.create({
  name: 'customFocus',

  addOptions() {
    return {
      className: 'has-focus',
      allowedTags: [],
      mode: 'all',
    }
  },

  addProseMirrorPlugins() {
    const pluginKey = customFocusPluginKey

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init() {
            return {
              focusedNode: null
            }
          },
          apply(tr, value) {
            return value
          }
        },
        props: {
          decorations: (state) => {
            const { doc, selection } = state
            const { anchor } = selection
            const decorations = []
            const pluginState = pluginKey.getState(state)

            if (!this.editor.isEditable || !this.editor.isFocused) {
              // 清除焦点节点信息
              if (pluginState) {
                pluginState.focusedNode = null
              }
              return DecorationSet.create(doc, [])
            }

            // 处理 deepest 模式的最大层级
            let maxLevels = 0
            if (this.options.mode === 'deepest') {
              doc.descendants((node, pos) => {
                if (node.isText) return
                
                const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1
                if (!isCurrent) return false
                
                maxLevels += 1
              })
            }

            let currentLevel = 0

            doc.descendants((node, pos) => {
              if (node.isText) return false

              const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1
              if (!isCurrent) return false

              currentLevel += 1

              const isAllowedTag = this.options.allowedTags.length === 0 || 
                                 this.options.allowedTags.includes(node.type.name)

              if (!isAllowedTag) return false

              const outOfScope = (this.options.mode === 'deepest' && maxLevels - currentLevel > 0)
                || (this.options.mode === 'shallowest' && currentLevel > 1)

              if (outOfScope) {
                return this.options.mode === 'deepest'
              }

              // 更新焦点节点信息
              if (pluginState) {
                pluginState.focusedNode = {
                  node,
                  pos,
                  type: node.type.name,
                  depth: currentLevel
                }
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className
                })
              )
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
}) 