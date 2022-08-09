import { Formalin } from '../core';


export const Components: Record<string, new () => Component<any>> = {

}

export default class Component<T extends object>  extends Formalin<T> {
	constructor() {
		super()
		this.registerComponents()
	}

	registerComponents() {
		Object.entries(this.components()).forEach(([key, value]) => {
			Components[key] = value
		})
	}

	components(): Record<string, new () => Component<any>>   {
		return {}
	}
}
