import { Formalin } from '../core';
import { create } from '../core/virtual-dom';

export default class Component<T extends object>  extends Formalin<T> {
	constructor() {
		super()
	}
}
