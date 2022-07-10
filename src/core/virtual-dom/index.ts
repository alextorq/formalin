export type VNode = {
    type: string
	attributes: Record<string, unknown>
    children?: Array<VNode> | string | number
}


export function create(type: string, attributes: Record<string, unknown> = {}, children: VNode['children']): VNode {
    return {
        type,
		attributes,
        children
    }
}
