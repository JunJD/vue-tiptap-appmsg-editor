<template>
  <base-config :node="node">
    <template #common-props>
      <div class="common-props">
        <div class="form-item">
          <label>背景设置</label>
          <div class="background-settings">
            <el-radio-group v-model="backgroundType" @change="handleBackgroundTypeChange">
              <el-radio label="color">颜色</el-radio>
              <el-radio label="image">图片</el-radio>
            </el-radio-group>
            
            <div v-if="backgroundType === 'color'" class="background-color">
              <el-color-picker
                v-model="backgroundColor"
                show-alpha
                @change="updateBackgroundColor"
              />
            </div>
            
            <div v-else class="background-image">
              <el-upload
                class="image-uploader"
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                @change="handleImageChange"
              >
                <div class="upload-area" v-if="!backgroundImage">
                  <el-icon><Plus /></el-icon>
                  <span>点击上传图片</span>
                </div>
                <div v-else class="preview-area">
                  <img :src="backgroundImage" class="preview-image" />
                  <div class="preview-actions">
                    <el-button type="danger" size="small" @click.stop="removeBackgroundImage">
                      移除图片
                    </el-button>
                  </div>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <template #specific-props>
      <div class="specific-props">
        <div class="border-settings">
          <h3>边框设置</h3>
          <div class="form-item">
            <label>边框样式</label>
            <el-select v-model="borderStyle" @change="updateBorder">
              <el-option label="无" value="" />
              <el-option label="实线" value="solid" />
              <el-option label="虚线" value="dashed" />
              <el-option label="点线" value="dotted" />
            </el-select>
          </div>
          
          <div class="form-item" v-if="borderStyle">
            <label>边框宽度</label>
            <el-input
              v-model="borderWidth"
              @change="updateBorder"
              placeholder="如：1px"
            >
              <template #append>px</template>
            </el-input>
          </div>
          
          <div class="form-item" v-if="borderStyle">
            <label>边框颜色</label>
            <el-color-picker
              v-model="borderColor"
              show-alpha
              @change="updateBorder"
            />
          </div>
          
          <div class="form-item">
            <label>圆角</label>
            <el-input
              v-model="borderRadius"
              @change="updateBorderRadius"
              placeholder="如：4px"
            >
              <template #append>px</template>
            </el-input>
          </div>
        </div>

        <div class="padding-settings">
          <h3>内边距设置</h3>
          <div class="padding-inputs">
            <div class="form-item">
              <label>上</label>
              <el-input
                v-model="paddingTop"
                @change="updatePadding('Top')"
                placeholder="如：20px"
              >
                <template #append>px</template>
              </el-input>
            </div>
            <div class="form-item">
              <label>右</label>
              <el-input
                v-model="paddingRight"
                @change="updatePadding('Right')"
                placeholder="如：20px"
              >
                <template #append>px</template>
              </el-input>
            </div>
            <div class="form-item">
              <label>下</label>
              <el-input
                v-model="paddingBottom"
                @change="updatePadding('Bottom')"
                placeholder="如：20px"
              >
                <template #append>px</template>
              </el-input>
            </div>
            <div class="form-item">
              <label>左</label>
              <el-input
                v-model="paddingLeft"
                @change="updatePadding('Left')"
                placeholder="如：20px"
              >
                <template #append>px</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-config>
</template>

<script setup>
import { ref, unref, watch, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import BaseConfig from './BaseConfig.vue'
import { editor } from "@/pages/editor/editor.js";
import { getId } from '../utils';
const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const nodeId = computed(() => {
  return getId(props.node)
})

// 解析样式字符串
const parseStyles = (styleString) => {
  if (!styleString) return {};
  return styleString.split(';')
    .filter(Boolean)
    .reduce((acc, style) => {
      const [key, value] = style.split(':').map(s => s.trim());
      if (key && value) acc[key] = value;
      return acc;
    }, {});
};

// 获取样式值
const getStyleValue = (styles, property, removePx = true) => {
  const value = styles[property];
  return removePx ? value?.replace('px', '') : value;
};

// 状态
const styles = computed(() => parseStyles(props.node.attrs.style || ''));

const backgroundColor = ref(styles.value['background-color'] || '');
const backgroundImage = ref(styles.value['background-image']?.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || '');
const backgroundType = ref(styles.value['background-image'] ? 'image' : 'color');

const paddingTop = ref(getStyleValue(styles.value, 'padding-top') || '');
const paddingRight = ref(getStyleValue(styles.value, 'padding-right') || '');
const paddingBottom = ref(getStyleValue(styles.value, 'padding-bottom') || '');
const paddingLeft = ref(getStyleValue(styles.value, 'padding-left') || '');

const borderStyle = ref(styles.value['border-style'] || '');
const borderWidth = ref(getStyleValue(styles.value, 'border-width') || '');
const borderColor = ref(styles.value['border-color'] || '');
const borderRadius = ref(getStyleValue(styles.value, 'border-radius') || '');

// 处理背景类型切换
const handleBackgroundTypeChange = (type) => {
  if (type === 'color') {
    editor.commands.setBackgroundImage(null, unref(nodeId))
  } else {
    editor.commands.setBackgroundColor(null, unref(nodeId))
  }
}

// 压缩图片
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 1200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          // 设置白色背景（可选）
          // ctx.fillStyle = '#FFFFFF'
          // ctx.fillRect(0, 0, width, height)
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // 根据原始文件类型选择输出格式
          const mimeType = file.type || 'image/jpeg'
          const quality = mimeType === 'image/png' ? undefined : 0.8
          
          const base64 = canvas.toDataURL(mimeType, quality)
          if (!base64.startsWith('data:image')) {
            throw new Error('Invalid image format')
          }
          resolve(base64)
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      img.src = e.target.result
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

// 处理图片上传
const handleImageChange = async (file) => {
  try {
    // 获取图片尺寸
    const dimensions = await getImageDimensions(file.raw);
    const aspectRatio = dimensions.height / dimensions.width;
    
    const compressedImage = await compressImage(file.raw);
    if (!compressedImage.startsWith('data:image')) {
      throw new Error('Invalid image format');
    }
    
    backgroundImage.value = compressedImage;
    
    // 设置背景图片和相应的高度
    const styles = {
      'background-image': `url('${compressedImage}')`,
      'background-size': 'contain',
      'background-repeat': 'no-repeat',
      'background-position': 'center top',
      'width': '100%',
      'padding-bottom': `${aspectRatio * 100}%`,
      'position': 'relative',
      'display': 'block'
    };
    
    editor.commands.updateStyle(styles, unref(nodeId));
  } catch (error) {
    console.error('Error processing image:', error);
    ElMessage.error('图片处理失败，请重试');
  }
};

// 获取图片尺寸
const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// 移除背景图片时也需要清除相关样式
const removeBackgroundImage = () => {
  backgroundImage.value = '';
  const styles = {
    'background-image': null,
    'background-size': null,
    'background-position': null,
    'padding-bottom': null,
    'position': null,
    'width': null,
    'display': null
  };
  editor.commands.updateStyle(styles, unref(nodeId));
};

// 更新方法
const updateBackgroundColor = (color) => {
  editor.commands.setBackgroundColor(color, unref(nodeId))
}

const updatePadding = (direction) => {
  const valueMap = {
    Top: paddingTop.value,
    Right: paddingRight.value,
    Bottom: paddingBottom.value,
    Left: paddingLeft.value
  }
  
  const value = valueMap[direction]
  if (value) {
    editor.commands.setPadding(
      direction.toLowerCase(), 
      value + 'px',
      unref(nodeId)
    )
  }
}

const updateBorder = () => {
  const params = {}
  
  if (borderStyle.value) {
    params.borderStyle = borderStyle.value
    params.borderWidth = borderWidth.value ? borderWidth.value + 'px' : '1px'
    params.borderColor = borderColor.value || '#000000'
  } else {
    params.borderStyle = null
    params.borderWidth = null
    params.borderColor = null
  }

  editor.commands.setBorder(params, unref(nodeId))
}

const updateBorderRadius = () => {
  if (borderRadius.value) {
    editor.commands.setBorderRadius(
      borderRadius.value + 'px',
      unref(nodeId)
    )
  } else {
    editor.commands.setBorderRadius(null, unref(nodeId))
  }
}

// 监听样式变化
watch(() => props.node.attrs.style, (newStyle) => {
  const newStyles = parseStyles(newStyle || '');
  backgroundColor.value = newStyles['background-color'] || '';
  backgroundImage.value = newStyles['background-image']?.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || '';
  backgroundType.value = newStyles['background-image'] ? 'image' : 'color';
  
  paddingTop.value = getStyleValue(newStyles, 'padding-top') || '';
  paddingRight.value = getStyleValue(newStyles, 'padding-right') || '';
  paddingBottom.value = getStyleValue(newStyles, 'padding-bottom') || '';
  paddingLeft.value = getStyleValue(newStyles, 'padding-left') || '';
  
  borderStyle.value = newStyles['border-style'] || '';
  borderWidth.value = getStyleValue(newStyles, 'border-width') || '';
  borderColor.value = newStyles['border-color'] || '';
  borderRadius.value = getStyleValue(newStyles, 'border-radius') || '';
}, { immediate: true });
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #606266;
    font-size: 14px;
  }
}

.padding-settings {
  margin-top: 24px;
  
  h3 {
    font-size: 14px;
    color: #606266;
    margin-bottom: 16px;
  }
}

.padding-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

:deep(.el-color-picker) {
  width: 100%;
}

:deep(.el-color-picker__trigger) {
  width: 100%;
  height: 32px;
  padding: 2px;
}

.border-settings {
  margin-bottom: 24px;
  
  h3 {
    font-size: 14px;
    color: #606266;
    margin-bottom: 16px;
  }
}

:deep(.el-select) {
  width: 100%;
}

.background-settings {
  .el-radio-group {
    margin-bottom: 12px;
  }
}

.image-uploader {
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    padding: 20px;
    
    &:hover {
      border-color: var(--el-color-primary);
    }
    
    .el-icon {
      font-size: 24px;
      color: #8c939d;
      margin-bottom: 8px;
    }
  }
  
  .preview-area {
    position: relative;
    
    .preview-image {
      width: 100%;
      height: 120px;
      object-fit: contain;
      background-repeat: no-repeat;
      border-radius: 6px;
    }
    
    .preview-actions {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
    }
    
    &:hover {
      .preview-actions {
        display: block;
      }
      
      .preview-image {
        filter: brightness(0.7);
      }
    }
  }
}
</style> 