export type VNode = {
    type: string
	attributes: Record<string, unknown>
    children?: Array<VNode> | string | number
	listners?: Record<string, () => unknown>
}


export function create(type: string, attributes: Record<string, unknown> = {}, children?: VNode['children'], listners: Record<string, () => unknown> = {}): VNode {
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
