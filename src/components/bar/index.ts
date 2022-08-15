import Component from '../../component';
import { create } from '../../core/virtual-dom';

type data = {
	progress: number
}
export default class Bar extends Component<data> {
	data() {
		return {
			progress: 0,
		}
	}

	mounted(): void {
		const timer = setInterval(() => {
			// this._data.progress++
			if (this._data.progress >= 100) {
				clearInterval(timer)
			}
		}, 1000)
	}

	style() {
		return {
			width: `${this._data.progress}%`,
			background: 'red',
			height: '20px',
			transition: 'all 1.4s'
		}
	}

	render(h: typeof create) {
		return h('div', {
			class: 'bar',
			style: this.style(),
		}, this._data.progress)
	}
}
