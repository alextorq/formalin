import { VNode } from '../virtual-dom';

export function renderHTML(node: VNode): HTMLElement {
	const element = document.createElement(node.type)
	const type = typeof node.children
	if (type === 'string' ||  type === 'number') {
		element.innerText = node.children?.toString()
	}

	Object.entries(node.attributes).forEach(([key, value]) => {
		element.setAttribute(key, value)
	})

	return element
}
