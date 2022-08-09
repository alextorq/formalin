import { capitalizeFirstLetter } from '../../utils';
import { VNode } from '../virtual-dom';
import {Components} from '../../component/index'


function setAttribute(el: Element, attr: VNode['attributes'], oldAttr: VNode['attributes']) {
	Object.entries(attr).forEach(([key, value]) => {
		if(key === 'style') {
			Object.assign(el.style, value);
		} else {
			if (oldAttr[key] !== attr[key]) {
				el.setAttribute(key, value)
			}
		}
	})
}

export function renderHTML(node: VNode, oldNode?: VNode): HTMLElement {
	let element = oldNode?.el || document.createElement(node.type)
	if (Components[node.type]) {
		const component = Components[node.type]
		const com = new component()
		element = com.create()
		com.mounted()
	}
	const type = typeof node.children
	if (type === 'string' ||  type === 'number' && node.children) {
		element.innerText = node.children?.toString()
	} else if (Array.isArray(node.children)) {
		node.children.forEach((i, index) => {
			const el = renderHTML(i, oldNode?.children[index])
			element.appendChild(el)
		})
	}

	Object.entries(node.listners || {}).forEach(([key, value]) => {
		const name = capitalizeFirstLetter(key.replace('on', ''))
		element.addEventListener(name, value)
	})

	setAttribute(element, node.attributes, oldNode?.['attributes'] ?? {})
	node.el = element
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

export function patch(oldTree: VNode, newTree: VNode): Array<() => Element|void> {
	const render = []
	if (oldTree.type !== newTree.type) {
		return [() => {
			unmound(oldTree)
			return renderHTML(newTree, oldTree)
		}]
	}
	const element = oldTree.el
	newTree.el = element
	if (Array.isArray(newTree.children)) {
		newTree.children.forEach((item, index) => {
			const prev = oldTree.children[index]
			render.push(...patch(prev, item))
		})
	}
	render.push(() => setAttribute(element, newTree['attributes'], oldTree['attributes']))
	return render
}
