import Component from '../../component';

export function mount(component: Component<any>,  selector: string|HTMLElement) {
	const el = typeof selector === 'string' ?  document.querySelector(selector) : selector
	if (el) {
		component.create()
		el.appendChild(component.mount())
		component.mounted()
	}else {
		throw new Error('element must be exist')
	}
}
