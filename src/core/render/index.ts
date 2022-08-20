import { capitalizeFirstLetter } from '../../utils';
import {TEXT, VNode} from '../virtual-dom';
import Component, {getDomElement, isComponent, reg} from '../../component/index'


function setAttribute(el: HTMLElement, attr: VNode['attributes'], oldAttr: VNode['attributes']) {
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

function setProps(node: VNode, component: Component<any>) {
	const props = getPropsVal(node, component)
	component.setProps(props)
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
		setProps(node, element)
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

	render.push(() => setAttribute(domElement, newTree['attributes'], oldTree['attributes']))

	newTree.children.forEach((item, index) => {
		const prev = oldTree.children[index]
		if (isComponent(prev && prev, prev && prev.el)) {
			setProps(item, prev.el)
			render.push(() => prev.el.rerender())
		}else {
			render.push(...patch(prev, item, newTree))
		}
	})

	return render
}
