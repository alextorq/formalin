import { renderHTML } from './render'
import { create, VNode } from './virtual-dom'

export class Formalin  {
	root: Element|null = null
	_data: Record<string, unknown> = {}

	data(){
		return {
			
		}
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
		if (!this.root) return new Error('element not found')
		const vDom = this.render(create)
		this.root.replaceChildren(renderHTML(vDom))
		this.updated()
	}
}
