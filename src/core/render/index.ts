import { capitalizeFirstLetter } from '../../utils';
import { VNode } from '../virtual-dom';
import {Components} from '../../component/index'



function setAttribute(el: Element, attr: VNode['attributes']) {
	Object.entries(attr).forEach(([key, value]) => {
		if(key === 'style') {
			Object.assign(el.style, value);
		} else {
			el.setAttribute(key, value)
		}
	})
}

export function renderHTML(node: VNode): HTMLElement {
	let element = document.createElement(node.type)
	if (Components[node.type]) {
		const component = Components[node.type]
		console.log(component);
		element = new component().create(element).root
	}
	

	
	const type = typeof node.children
	if (type === 'string' ||  type === 'number' && node.children) {
		element.innerText = node.children?.toString()
	}else if (Array.isArray(node.children)) {
		node.children.forEach((i) => {
			element.appendChild(renderHTML(i))
		})
	}


	Object.entries(node.listners || {}).forEach(([key, value]) => {
		const name = capitalizeFirstLetter(key.replace('on', ''))
		element.addEventListener(name, value)
	})

	setAttribute(element, node.attributes)
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



export function patch(oldTree: VNode, newTree: VNode) {
	if (oldTree.type !== newTree.type) {
		return () => {
			unmound(oldTree)
			return renderHTML(newTree)
		}
	}

	return () => renderHTML(newTree)
}
