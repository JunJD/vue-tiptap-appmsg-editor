import { Extension } from '@tiptap/core'

export const NodeId = Extension.create({
  name: 'nodeId',

  priority: -1000, // 改为低优先级，确保在其他扩展之后运行

  addGlobalAttributes() {
    return [
      {
        types: ['section', 'paragraph', 'image'], // 在这里添加需要支持 ID 的节点类型
        attributes: {
          id: {
            default: null,
            parseHTML: element => element.getAttribute('data-node-id'),
            renderHTML: attributes => {
              if (!attributes.id) {
                return {}
              }
              return {
                'data-node-id': attributes.id,
              }
            },
          },
        },
      },
    ]
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
        return id; // 直接返回生成的 ID 字符串
      },
    }
  },
}) 