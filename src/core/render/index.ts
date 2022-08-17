import { capitalizeFirstLetter } from '../../utils';
import {TEXT, VNode} from '../virtual-dom';
import Component, {getDomElement, isComponent, reg} from '../../component/index'


function setAttribute(el: HTMLElement, attr: VNode['attributes'], oldAttr: VNode['attributes']) {
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
	let element: Component<any>| ReturnType<typeof createElement> = createElement(node, oldNode)
	let domElement: HTMLElement = element as HTMLElement
	if (isComponent(node, node.el)) {
		const component = reg.getByKey(node.type)
		element = new component()
		domElement = element.create()
		element.mounted()
	}

	if (node.children) {
		node.children.forEach((i, index) => {
			const el = renderHTML(i, oldNode?.children[index])
			domElement.appendChild(el)
		})
	}

	addEventListener(domElement, node)
	setAttribute(domElement, node.attributes, oldNode?.['attributes'] ?? {})

	node.el = element
	return domElement
}

export function unmound(tree: VNode) {
	const element = isComponent(tree, tree.el) ? tree.el.root : tree.el
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
	const domElement = getDomElement(oldTree)
	newTree.el = oldTree.el
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

	render.push(() => setAttribute(domElement, newTree['attributes'], oldTree['attributes']))
	return render
}
