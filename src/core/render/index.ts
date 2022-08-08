import { capitalizeFirstLetter } from '../../utils';
import { VNode } from '../virtual-dom';
import {Components} from '../../component/index'

export function renderHTML(node: VNode): HTMLElement {
	const element = document.createElement(node.type)
	if (Components[node.type]) {
		const component = Components[node.type]
		console.log(component);
		new component()
	}
	

	node.el = element
	const type = typeof node.children
	if (type === 'string' ||  type === 'number' && node.children) {
		element.innerText = node.children?.toString()
	}else if (Array.isArray(node.children)) {
		node.children.forEach((i) => {
			element.appendChild(renderHTML(i))
		})
	}

	Object.entries(node.attributes).forEach(([key, value]) => {
		if(key === 'style') {
			Object.assign(element.style, value);
		} else {
			element.setAttribute(key, value)
		}
	})


	Object.entries(node.listners || {}).forEach(([key, value]) => {
		const name = capitalizeFirstLetter(key.replace('on', ''))
		element.addEventListener(name, value)
	})

	return element
}

export function unmound(tree: VNode) {
	const element = tree.el
	const listners = tree.listners || {}
	if (element) {
		for (const key of listners) {
			const name = capitalizeFirstLetter(key.replace('on', ''))
			element.removeEventListener(name, listners[key])
		}
		element.remove()
	}
}



export function patch(oldTree: VNode, newTree: VNode) {
	if (oldTree.type !== newTree.type) {
		return () => {
			unmound(oldTree)
			return renderHTML(newTree)
		}
	}

	return () => renderHTML(newTree)
}
