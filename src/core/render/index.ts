import { capitalizeFirstLetter } from '../../utils';
import {TEXT, VNode} from '../virtual-dom';
import Component, {getDomElement, isComponent, reg} from '../../component/index'


function setAttribute(el: HTMLElement, attr: VNode['attributes'], oldAttr: VNode['attributes']) {

	console.log({attr, oldAttr});
	

	Object.entries(attr).forEach(([key, value]) => {
		if (oldAttr[key] !== attr[key]) {
			if(key === 'style') {
				Object.assign(el.style, value);
			}
			else {
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

function getPropsSpec(component: Component<any>) {
	const propsSpec = {}
	if (component.propsSpec) {
		Object.assign(propsSpec, component.propsSpec)
	}
	return propsSpec
}

function getPropsVal(node: VNode, component: Component<any>) {
	const propsDefault = getPropsSpec(component)
	const accum: Record<string, any> = {}
	Object.keys(propsDefault).map((currentValue) => {
		if (node.attributes[currentValue] !== undefined) {
			accum[currentValue] = node.attributes[currentValue] || propsDefault[currentValue]
		}
	})
	return accum
}

export function setProps(node: VNode, component: Component<any>) {
	const props = getPropsVal(node, component)
	component.setProps(props)
}

function createElement(node: VNode, oldNode?: VNode): NonNullable<VNode['el']> {
	if (node.type === TEXT) {
		return document.createTextNode(node.val as string)
	}
	return oldNode?.el || document.createElement(node.tag)
}

export function renderHTML(node: VNode, oldNode?: VNode): NonNullable<VNode['el']> {
	let domElement = createElement(node, oldNode)

	if (node.component) {
		domElement = node.component.mount()
		node.component.mounted()
	}

	node.children.forEach((i, index) => {
		const el = renderHTML(i, oldNode?.children[index])
		domElement.appendChild(el)
	})

	addEventListener(domElement, node)
	setAttribute(domElement, node.attributes, oldNode?.['attributes'] ?? {})

	node.el = domElement
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

	render.push(() => setAttribute(domElement, newTree['attributes'], oldTree['attributes']))

	newTree.children.forEach((item, index) => {
		const prev = oldTree.children[index]
		if (prev?.component && isComponent(prev.component)) {
			setProps(item, prev.component)
			render.push(() => prev.component.rerender())
		} else {
			render.push(...patch(prev, item, newTree))
		}
	})

	return render
}
