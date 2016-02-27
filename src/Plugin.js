export default class Plugin {
	constructor() {
		var { name } = this.constructor

		var isSoucePlugin = this.start || this.stop
		if (isSoucePlugin && (!this.start || !this.stop))
			console.error(`Plugins must implement start and stop together. Check the plugin ${name}`)

		if (!this.reduce)
			console.error(`Plugins must implement reduce. Check the plugin ${name}`)
	}
}

Plugin.contextTypes = {}