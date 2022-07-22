import {currentComponent} from '../index'


export function reactive<T extends Record<string, any>>(data: T) {
	const watch = currentComponent.current?.rerender.bind(currentComponent.current)
	return new Proxy(data, {
		get(target, prop: keyof T) {
			return target[prop];
		},
		set(target, prop: keyof T, val) { // для перехвата записи свойства
			target[prop] = val;
			// console.log(watch);
			watch && watch()
			return true;
		}
	});
}
