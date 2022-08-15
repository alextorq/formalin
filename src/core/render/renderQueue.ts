type render = () => unknown

class RenderQueue {
	private queue: Array<render> = []

	public add(render: render) {
		this.queue.push(render)
	}

	execute() {
		let render = this.queue.pop()
		while (render) {
			render()
			render = this.queue.pop()
		}
	}
}


export default new RenderQueue()
