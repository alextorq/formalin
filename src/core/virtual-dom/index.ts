import Component from '../../component';

export type VNode = {
    type: string
	attributes: Record<string, unknown>
    children: Array<VNode>
	listners?: Record<string, (e: Event) => unknown>
	el?: HTMLElement|Component<any>|Text
	val?: string | number
}

type children = Array<VNode> | string | number

export const TEXT = 'text'

export function create(type: string, attributes: VNode['attributes'] = {}, children: children = [], listners: VNode['listners'] = {}): VNode {
	const isNs = typeof children !== 'object'

	const childrenFinal = isNs ? [{
		...create(TEXT, {}, []),
		val: children
	}] : children

    return {
        type,
		attributes,
		children: childrenFinal,
		listners
    }
}


export function getDiff(oldTrhee: VNode, newTrhee: VNode) {
	return
}
