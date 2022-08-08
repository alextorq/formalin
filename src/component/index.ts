import { Formalin } from '../core';


export const Components: Record<string, Component<any>> = {

}

export default class Component<T extends object>  extends Formalin<T> {
	constructor() {
		super()
		Components[this.constructor.name] = (this.constructor as Component<any>)
	}
}
