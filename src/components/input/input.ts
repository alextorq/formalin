import Component from '../../component';
import { create } from '../../core/virtual-dom';

export default class Input extends Component<{value: string}> {
	data() {
		return {
			value: ''
		}
	}

	mounted(): void {
		// setInterval(() => {
		// 	this._data.value += 'a' 
		// }, 1000)
	}


	render(h: typeof create) {
		return h('input', {
			class: 'bar',
			value: this._data.value
		}, undefined, {
			onclick: () => this.click()
		})
	}
	click(): unknown {
		console.log('click');
	}
}
