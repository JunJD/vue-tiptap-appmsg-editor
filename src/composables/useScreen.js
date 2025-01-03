import { useScreenStore } from "../stores/modules/screen"

export const useScreen = () => {
    const { screenId, screenName, screenDetail, metaData, setScreenId, setScreenName, setMetaData, setScreenDetail } = useScreenStore()
    return {
        screenId,
        screenName,
        screenDetail,
        metaData,
        setScreenId,
        setScreenName,
        setMetaData,
        setScreenDetail
    }
}

export const useScreenDetail = () => {
    const { screenDetail, setScreenDetail, addViewNode, removeViewNode, updateViewNode } = useScreenStore()
    return {
        screenDetail,
        setScreenDetail,
        addViewNode,
        removeViewNode,
        updateViewNode
    }
}

export const useInitScreen = () => {
    const { screenId, screenName, metaData, screenDetail, setScreenId, setScreenName, setScreenDetail, setMetaData} = useScreen()
    if(!screenId) {
        setScreenId(1)
    }
    if(!screenName) {
        setScreenName("未命名")
    }
    if(!metaData) {
        setMetaData({})
    }
    if(!screenDetail) {
        setScreenDetail({
            viewNodeList: []
        })
    }
}