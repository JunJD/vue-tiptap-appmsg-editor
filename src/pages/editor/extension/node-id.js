import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const NodeId = Extension.create({
  name: 'nodeId',

  priority: -1000, // 改为低优先级，确保在其他扩展之后运行

  addGlobalAttributes() {
    return [
      {
        types: ['section', 'paragraph', 'rankingList', 'opForm'],
        attributes: {
          id: {
            default: null,
            parseHTML: element => {
              return element.getAttribute('data-node-id') || 
                     element.getAttribute('id') || 
                     element.getAttribute('data-id');
            },
            renderHTML: attributes => {
              if (!attributes.id) {
                return {}
              }
              return {
                'data-node-id': attributes.id,
                'id': attributes.id,
              };
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    const supportedTypes = ['section', 'paragraph', 'rankingList', 'opForm'];
    
    console.log('Supported node types:', supportedTypes);
    
    const plugin = new Plugin({
      key: new PluginKey('node-id'),
      props: {
        transformPastedHTML: html => {
          return html;
        },
      },
      appendTransaction: (transactions, oldState, newState) => {
        const relevantTr = transactions.find(tr => {
          return tr.docChanged || tr.getMeta('addNodeView');
        });

        if (!relevantTr) return null;

        const tr = newState.tr;
        let hasChanges = false;

        console.log('Checking nodes for IDs...');
        newState.doc.descendants((node, pos) => {
          const nodeType = node.type.name;
          console.log('Found node:', nodeType, 'has id:', node.attrs.id);
          
          if (supportedTypes.includes(nodeType) && !node.attrs.id) {
            console.log('Setting ID for node type:', nodeType, 'at position:', pos);
            const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            tr.setNodeAttribute(pos, 'id', id);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          console.log('Changes made, applying transaction');
          tr.setMeta('addNodeId', true);
          return tr;
        }

        return null;
      },
    })

    return [plugin]
  },

  addCommands() {
    return {
      // 查找指定 ID 的节点位置
      findNodeById: (id) => ({ state }) => {
        let targetPos = null;
        state.doc.descendants((node, pos) => {
          if (node.attrs.id === id) {
            targetPos = pos;
            return false;
          }
        });
        return targetPos;
      },

      // 为节点设置 ID
      setNodeId: (pos, id) => ({ tr }) => {
        tr.setNodeAttribute(pos, 'id', id);
        return true;
      },

      // 生成新的唯一 ID
      generateNodeId: () => () => {
        const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('generateNodeId:', id);
        return id;
      },
    }
  },
}) 