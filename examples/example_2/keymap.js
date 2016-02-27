import { Plugin } from '/src/index'

export default class keymap extends Plugin {
	constructor() {
		super()
		this.pressedKeys = {}
	}

	reduce() {
		var { keyevent } = this.context
		if (!keyevent)
			return

		this.pressedKeys = { ...this.pressedKeys }

		var { type, code } = this.context.keyevent
		if (type == 'keydown')
			this.pressedKeys[code] = true
		else
			delete this.pressedKeys[code]

		return this.pressedKeys
	}
}

keymap.namespace = 'keymap'

keymap.contextTypes = {
	keyevent: true
}