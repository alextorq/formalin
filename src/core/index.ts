import { reactive } from './reactive'
import { patch, renderHTML, unmound } from './render'
import { create, VNode } from './virtual-dom'


export class Formalin<T extends object = Record<string, any>>  {
	root: HTMLElement|null = null
	protected _data: T = {} as T

	private _oldVal: VNode|null = null

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

	create() {
		this._oldVal = this.render(create)
		this.root = renderHTML(this._oldVal)
		return this.root
	}

	unmount() {
		unmound(this._oldVal!)
	}

    render(h: typeof create): VNode {
        return h('', {}, '')
    }

    mounted() {
        // console.log('mounted');
    }

	updated() {
		// console.log('updated');
	}


	rerender() {
		if (!this.root) throw new Error('element not found')
		const tree = this.render(create)
		const old = this._oldVal
		const patchFun = patch(old!, tree)
		patchFun.forEach((render) => {
			render()
		})
		this._oldVal = tree
		this.updated()
	}
}


export const currentComponent: {current: Formalin|null} = {
	current: null
}
