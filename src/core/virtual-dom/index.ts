export type VNode = {
    type: string
	attributes: Record<string, unknown>
    children?: Array<VNode> | string | number
	listners?: Record<string, (e: Event) => unknown>
	el?: HTMLElement
}

export function create(type: string, attributes: VNode['attributes'] = {}, children?: VNode['children'], listners: VNode['listners'] = {}): VNode {
    return {
        type,
		attributes,
        children,
		listners
    }
}



export function getDiff(oldTrhee: VNode, newTrhee: VNode) {
	return
}
