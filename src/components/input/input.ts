import Component from '../../component';
import { create } from '../../core/virtual-dom';
import Bar from '../bar';

export default class Input extends Component<{value: number}> {
	data() {
		return {
			value: 0
		}
	}

	mounted(): void {
		// setInterval(() => {
		// 	this._data.value += 'a'
		// }, 1000)
	}

	components() {
		return {
			'Bar': Bar,
		}
	}

	render(h: typeof create) {
		const input = h('input', {
			value: this._data.value
		}, [], {
			onInput: (e: any) => this.onInput(e)
		})

		const bar = h('Bar', {
			class: 'bar',
			progress: +this._data.value
		}, [])

		const res = h('div', {}, [input, bar])
		
		return res
	}

	onInput(e: InputEvent) {
		this._data.value = +e?.target?.value
	}
}
