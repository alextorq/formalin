import { capitalizeFirstLetter } from '../../utils';
import {TEXT, VNode} from '../virtual-dom';
import {isComponent, reg} from '../../component/index'


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


function addEventListener(element: HTMLElement, node: VNode) {
	Object.entries(node.listners || {}).forEach(([key, value]) => {
		const name = capitalizeFirstLetter(key.replace('on', ''))
		element.addEventListener(name, value)
	})
}


function createElement(node: VNode, oldNode?: VNode) {
	if (node.type === TEXT) {
		return document.createTextNode(node.val as string)
	}
	return oldNode?.el || document.createElement(node.type)
}

export function renderHTML(node: VNode, oldNode?: VNode): HTMLElement {
	let element = createElement(node, oldNode)
	if (isComponent(node)) {
		const component = reg.getByKey(node.type)
		const com = new component()
		element = com.create()
		com.mounted()
	}

	if (node.children) {
		node.children.forEach((i, index) => {
			const el = renderHTML(i, oldNode?.children[index])
			element.appendChild(el)
		})
	}

	addEventListener(element, node)
	setAttribute(element, node.attributes, oldNode?.['attributes'] ?? {})

	node.el = element
	return element
}

export function unmound(tree: VNode) {
	const element = tree.el
	const listeners = tree.listners || {}
	if (element) {
		Object.keys(listeners).map((key) => {
			const name = capitalizeFirstLetter(key.replace('on', ''))
			element.removeEventListener(name, listeners[key])
		})
		element.remove()
	}
}

export function patch(oldTree: VNode, newTree: VNode, parent?: VNode): Array<() => Element|void> {
	const render = []
	const isText = newTree.val !== oldTree.val
	const element = oldTree.el
	newTree.el = element
	if (oldTree.type !== newTree.type || isText) {
		return [() => {
			unmound(oldTree)
			parent?.el?.appendChild(renderHTML(newTree, oldTree))
		}]
	}
	if (Array.isArray(newTree.children)) {
		newTree.children.forEach((item, index) => {
			const prev = oldTree.children[index]
			render.push(...patch(prev, item, newTree))
		})
	}

	render.push(() => setAttribute(element, newTree['attributes'], oldTree['attributes']))
	return render
}
