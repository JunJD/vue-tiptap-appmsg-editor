import SectionConfig from '../components/SectionConfig.vue'
// 定义不同类型节点的配置项
export const nodeConfigs = {
//   paragraph: {
//     component: 'ParagraphConfig',
//     commonProps: ['color', 'fontSize', 'alignment'],
//     specificProps: ['lineHeight', 'letterSpacing']
//   },
//   heading: {
//     component: 'HeadingConfig',
//     commonProps: ['color', 'fontSize', 'alignment'],
//     specificProps: ['level']
//   },
//   image: {
//     component: 'ImageConfig',
//     commonProps: ['width', 'height'],
//     specificProps: ['src', 'alt', 'fit']
//   },
  section: {
    component: 'SectionConfig',
    commonProps: ['backgroundColor'],
    specificProps: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    component: SectionConfig
  }
} 