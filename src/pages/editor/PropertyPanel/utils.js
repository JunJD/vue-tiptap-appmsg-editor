export const getId = (node) => {
    if (!node) return
    return node.attrs.id
}

export const getTypeName = (node) => {
    if (!node) return
    return node.type.name
}