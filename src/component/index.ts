import { Formalin } from '../core';
import {VNode} from '../core/virtual-dom';
type componentConstructor =  new () => Component<any>

class Register {
	store: Record<string, componentConstructor> = {}


	addComponent(key: string, component: componentConstructor) {
		this.store[key] = component
	}

	getByKey(key: string) {
		return this.store[key]
	}
}

export const reg = new Register()


export default class Component<T extends object>  extends Formalin<T> {
	constructor() {
		super()
		this.registerComponents()
	}

	// props: {
	// 	title: String,
	// 	likes: Number
	// }

	private registerComponents() {
		Object.entries(this.components()).forEach(([key, value]) => {
			reg.addComponent(key, value)
		})
	}

	public components(): Record<string, componentConstructor>   {
		return {}
	}
}


export function isComponent(node: VNode, el: VNode['el']): el is Component<never> {
	return !!reg.getByKey(node.type)
}



export function getDomElement(node: VNode): HTMLElement {
	const el = node.el
	return  isComponent(node, el) ? el.root as HTMLElement : el as HTMLElement
}
