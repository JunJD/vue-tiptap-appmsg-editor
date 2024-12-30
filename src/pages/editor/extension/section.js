import { Node, mergeAttributes } from "@tiptap/core";

export default Node.create({
  name: "section",
  group: "block",
  content: "block+",

  addOptions() {
    return {
      defaultContent: '<p>请输入内容</p>',
    };
  },

  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      // 保留id属性，用于定位节点
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "section" }];
  },

  renderHTML({ HTMLAttributes }) {
    // 直接使用mergeAttributes，让Tiptap处理属性合并
    return ["section", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      insertSection: () => ({ chain, dispatch, tr, state, editor }) => {
        const sectionId = editor.commands.generateNodeId();
        
        const node = state.schema.nodes[this.name].create(
          { id: sectionId },
          [state.schema.nodes.paragraph.create(
            null,
            [state.schema.text('请输入内容')]
          )]
        );

        if (dispatch) {
          const pos = state.selection.$from.before();
          tr.insert(pos, node);
          return true;
        }

        return false;
      },
      
      updateStyle: (styleUpdates, nodeId) => ({ chain, state, commands }) => {
        const targetPos = commands.findNodeById(nodeId);
        if (targetPos === null) return false;

        return chain()
          .command(({ tr }) => {
            const node = state.doc.nodeAt(targetPos);
            // 解析当前所有样式
            const currentStyles = {};
            if (node.attrs.style) {
              // 先处理background-image，因为它可能包含分号
              const bgImageMatch = node.attrs.style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
              if (bgImageMatch) {
                currentStyles['background-image'] = `url('${bgImageMatch[1]}')`;
              }

              // 处理其他样式
              const styleString = node.attrs.style
                .replace(/background-image:\s*url\(['"]?(.*?)['"]?\)/, '') // 临时移除background-image
                .trim();
              
              if (styleString) {
                styleString.split(';').forEach(style => {
                  const [key, ...values] = style.split(':');
                  if (key && values.length) {
                    const value = values.join(':').trim(); // 重新组合可能包含冒号的值
                    if (value) {
                      currentStyles[key.trim()] = value;
                    }
                  }
                });
              }
            }

            // 检查是否有背景图片相关样式，如果有就保留
            if (currentStyles['background-image']) {
              if (styleUpdates['background-color'] === null && !styleUpdates['background-image']) {
                delete styleUpdates['background-color'];
              }
              if (!styleUpdates['background-image']) {
                styleUpdates['background-image'] = currentStyles['background-image'];
                styleUpdates['background-size'] = currentStyles['background-size'] || 'contain';
                styleUpdates['background-position'] = currentStyles['background-position'] || 'center top';
                styleUpdates['background-repeat'] = currentStyles['background-repeat'] || 'no-repeat';
              }
            }

            // 更新样式
            Object.entries(styleUpdates).forEach(([key, value]) => {
              if (value === null) {
                delete currentStyles[key];
              } else {
                currentStyles[key] = value;
              }
            });

            // 生成新的样式字符串
            const newStyle = Object.entries(currentStyles)
              .filter(([key, value]) => key && value)
              .map(([key, value]) => `${key}:${value}`)
              .join(';');

            console.log('Updating styles:', {
              current: node.attrs.style,
              updates: styleUpdates,
              result: newStyle
            });

            tr.setNodeAttribute(targetPos, 'style', newStyle || null);
            return true;
          })
          .run();
      },

      setBackgroundImage: (imageUrl, nodeId) => ({ chain, commands }) => {
        const styles = imageUrl ? {
          'background-image': `url('${imageUrl}')`,
          'background-size': 'contain',
          'background-position': 'center top',
          'background-repeat': 'no-repeat',
          'width': '100%',
          'position': 'relative',
          'display': 'block'
        } : {
          'background-image': null,
          'background-size': null,
          'background-position': null,
          'background-repeat': null,
          'width': null,
          'padding-bottom': null,
          'position': null,
          'display': null
        };
        
        return commands.updateStyle(styles, nodeId);
      },

      setBackgroundColor: (color, nodeId) => ({ chain, commands }) => {
        return commands.updateStyle({
          'background-color': color || null
        }, nodeId);
      },

      setBorder: (params, nodeId) => ({ chain, commands }) => {
        const styles = {};
        if (params.borderStyle) {
          styles['border-style'] = params.borderStyle;
          styles['border-width'] = params.borderWidth || '1px';
          styles['border-color'] = params.borderColor || '#000000';
        } else {
          styles['border-style'] = null;
          styles['border-width'] = null;
          styles['border-color'] = null;
        }
        return commands.updateStyle(styles, nodeId);
      },

      setBorderRadius: (value, nodeId) => ({ chain, commands }) => {
        return commands.updateStyle({
          'border-radius': value || null
        }, nodeId);
      },

      setPadding: (direction, value, nodeId) => ({ chain, commands }) => {
        return commands.updateStyle({
          [`padding-${direction}`]: value || null
        }, nodeId);
      },
    };
  },
});
