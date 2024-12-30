import { provide, inject, defineComponent, readonly, unref, shallowRef } from "vue"

const PropertySettingProviderKey = Symbol('PropertySettingProviderKey')

export const PropertySettingProvider = defineComponent({
  name: 'PropertySettingProvider',
  setup(_, { slots }) {
    const activeNode = shallowRef(null)
    const setActiveNode = (node) => {
      console.log(node, 'node')
      activeNode.value = unref(node)
    }
    
    provide(PropertySettingProviderKey, {
      activeNode,
      setActiveNode
    })

    return () => slots.default?.()
  },
})

export const usePropertySetting = () => {
  return inject(PropertySettingProviderKey)
}