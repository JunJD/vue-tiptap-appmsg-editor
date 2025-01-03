import { defineStore } from "pinia";

const metaData = {
    margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    backgroundColor: '#ffffff',
}

export const useScreenStore = defineStore("screen", {
  state: () => ({
    screenId: null,
    screenName: null,
    metaData: metaData,
    screenDetail: {
        viewNodeList: [],
    }
  }),
  actions: {
    setScreenId(id) {
        this.screenId = id
    },
    setScreenName(name) {
        this.screenName = name
    },
    setScreenDetail(detail) {
        this.screenDetail = detail
    },
    setMetaData(metaData) {
        this.metaData = metaData
    },
    addViewNode(node) {
        this.screenDetail.viewNodeList.push(node)
    },
    removeViewNode(index) {
        this.screenDetail.viewNodeList.splice(index, 1)
    },
    updateViewNode(index, node) {
        this.screenDetail.viewNodeList[index] = node
    }
  },
  //   持久化
  persist: {
    storage: localStorage,
    paths: ['metaData', 'screenDetail']
  }
});
