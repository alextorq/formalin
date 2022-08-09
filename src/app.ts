import Input from './components/input/input'
import {mount} from './core/render/mount';

document.addEventListener('DOMContentLoaded', () => {
	mount(new Input(), '#app')
})
