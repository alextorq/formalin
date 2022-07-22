import { reactive } from './reactive'
import { renderHTML } from './render'
import { create, VNode } from './virtual-dom'





export class Formalin<T extends object = Record<string, any>>  {
	root: Element|null = null
	protected _data: T = {} as T

	constructor() {
		currentComponent.current = this
		if (typeof this.data === 'function') {
			this._data = reactive(this.data())
		} else {
			currentComponent.current = null
			throw Error('data must be function')
		}
		currentComponent.current = null
	}

	data(): T  {
		return {} as T
	}

	mount(selector: string) {
		this.root = document.querySelector(selector)
		if (!this.root) return new Error('element not found')
		const vDom = this.render(create)
		this.root.appendChild(renderHTML(vDom))
		this.mounted()
		return this
	}

    render(h: typeof create): VNode {
        return h('', {}, '')
    }

    mounted() {
        console.log('mounted');
    }

	updated() {
		console.log('updated');
	}


	rerender() {
		if (!this.root) throw new Error('element not found')
		const vDom = this.render(create)
		this.root.replaceChildren(renderHTML(vDom))
		this.updated()
	}
}


export const currentComponent: {current: Formalin|null} = {
	current: null
}
