import SectionConfig from '../components/SectionConfig.vue'
import RankingConfig from '../components/RankingConfig.vue'

// 定义不同类型节点的配置项
export const nodeConfigs = {
  section: {
    component: SectionConfig,
    commonProps: ['backgroundColor'],
    specificProps: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
  },
  rankingList: {
    component: RankingConfig,
    commonProps: ['backgroundColor'],
    specificProps: ['data', 'columns', 'autoScroll', 'scrollInterval']
  }
} 
