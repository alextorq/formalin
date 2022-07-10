import Component from '../../component';
import { create } from '../../core/virtual-dom';

export default class Bar extends Component {
	data() {
		return {
			greeten: 'Hello World',
			count: 1,
		}
	}

	mounted(): void {
		setTimeout(() => {
			this._data.count = 2
			this.rerender()
		}, 1000)
	}

	updated(): void {
		setTimeout(() => {
			this._data.count++
			this.rerender()
		}, 2000)
	}

	render(h: typeof create) {
		return h('div', {
			class: 'bar',
		}, this._data.count)
	}
}
