import { Plugin } from '/src/index'

export default class keyevent extends Plugin {
	constructor() {
		super()
		this.event = null
	}

	handleEvent(event) {
		this.event = event
		this.forceUpdate()
	}

	start() {
		window.onkeydown = ::this.handleEvent
		window.onkeyup = ::this.handleEvent
	}

	stop() {
		window.onkeydown = null
		window.onkeyup = null
	}

	reduce() {
		return this.event
	}
}

keyevent.namespace = 'keyevent'