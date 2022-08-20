import Component from '../../component';
import { create } from '../../core/virtual-dom';

type props = {
	progress: number
}

type data = {
	progress: number
}
export default class Bar extends Component<data, props> {

	propsSpec = {
		progress: 0
	}

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
			width: `${this.props.progress}%`,
			background: 'red',
			height: '20px',
			transition: 'all 1.4s'
		}
	}

	render(h: typeof create) {
		return h('div', {
			class: 'bar',
			style: this.style(),
		}, this.props.progress)
	}
}
