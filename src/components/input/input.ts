import Component from '../../component';
import { create } from '../../core/virtual-dom';

export default class Input extends Component<{value: string}> {
	data() {
		return {
			value: ''
		}
	}

	mounted(): void {
		setInterval(() => {
			// this._data.value += 'a' 
		}, 1000)
	}


	render(h: typeof create) {
		const input = h('input', {
			class: 'bar',
			value: this._data.value
		}, undefined, {
			onInput: (e) => this.onInput(e)
		})


		const bar = h('Bar', {
			class: 'bar',
		})

		return h('div', {}, [input, bar])
	}

	onInput(e) {
		this._data.value = e.target.value
	}
}
