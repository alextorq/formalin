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

	registerComponents() {
		Object.entries(this.components()).forEach(([key, value]) => {
			reg.addComponent(key, value)
		})
	}

	components(): Record<string, componentConstructor>   {
		return {}
	}
}


export function isComponent(node: VNode) {
	return !!reg.getByKey(node.type)
}
