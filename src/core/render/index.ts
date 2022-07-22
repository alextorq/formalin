import { VNode } from '../virtual-dom';

export function renderHTML(node: VNode): HTMLElement {
	const element = document.createElement(node.type)
	const type = typeof node.children
	if (type === 'string' ||  type === 'number' && node.children) {
		element.innerText = node.children?.toString()
	}

	Object.entries(node.attributes).forEach(([key, value]) => {
		if(key === 'style') {
			Object.assign(element.style, value);
		} else {
			element.setAttribute(key, value)
		}
	})


	Object.entries(node.listners || {}).forEach(([key, value]) => {
		const name = key.replace('on', '')
		element.addEventListener(name, value)
	})

	return element
}
