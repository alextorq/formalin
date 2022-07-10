import { Formalin } from '../core';
import { create } from '../core/virtual-dom';

export default class Component  extends Formalin {
	constructor() {
		super()
		if (typeof this.data === 'function') {
			this._data =  this.data()
		}
	}
}
