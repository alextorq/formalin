import Component, { isComponent, reg } from '../../component';
import { setProps } from '../render';

export type VNode = {
    type: string
	tag: string
	component: null|Component<any, any>
	attributes: Record<string, unknown>
    children: Array<VNode>
	listners?: Record<string, (e: Event) => unknown>
	el?: HTMLElement|Text
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

	const node: VNode = {
		type,
		tag: type,
		component: null,
		attributes,
		children: childrenFinal,
		listners
	}

	if (isComponent(node)) {
		const componentConstructor = reg.getByKey(node.type)
		const component = new componentConstructor()
		setProps(node, component)
		
		const vNode = component.create()

		node.tag = vNode.tag
		node.children = vNode.children
		node.component = component
	}


    return node
}


export function getDiff(oldTrhee: VNode, newTrhee: VNode) {
	return
}
