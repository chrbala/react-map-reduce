import React, { Component } from 'react'

import { getContext, getStatelessScope, getProps, getPluginType, getPluginNamespace } from './lib'

export default class Reducer extends Component {
	constructor() {
		super()
		this.runningPlugins = {}
	}

	getChildContext() {
		var modulatorContext = { ...this.context.modulatorContext }
		for (let name in this.runningPlugins) {
			var plugin = this.runningPlugins[name]
			var namespace = getPluginNamespace(plugin)

			var value
			if (plugin.reduce)
				value = plugin.reduce()
			else {
				var actualProps = this.props[name]
				var { contextTypes, defaultProps } = plugin
				var scope = getStatelessScope({plugin, actualProps, modulatorContext, contextTypes, defaultProps})

				value = plugin.call(scope)
			}

			modulatorContext[namespace] = value
		}

		return { modulatorContext }
	}

	update(props) {
		this.nextProps = props
		var { plugins: _plugins } = props

		var modulator = this
		const initPlugin = (plugin, name) => {
			Object.defineProperty(plugin, 'props', { 
				get() {
					var defaultProps = plugin.constructor.defaultProps
					var actualProps = modulator.nextProps[name]
					return getProps({defaultProps, actualProps})
				}
			})

			Object.defineProperty(plugin, 'context', { 
				get() {
					var { modulatorContext } = modulator.context
					var { contextTypes } = plugin.constructor

					try {
						return getContext({plugin, modulatorContext, contextTypes})
					} catch (e) {
						console.error(e)
					}
				}
			})

			plugin.forceUpdate = ::modulator.forceUpdate

			if (plugin.start)
				plugin.start()

			return plugin
		}

		for (let name in _plugins)
			if (!this.runningPlugins[name]) {
				var _plugin = _plugins[name]
				if (getPluginType(_plugin) == 'constructor')
					this.runningPlugins[name] = initPlugin(new _plugins[name](), name)
				else
					this.runningPlugins[name] = _plugin
			}

		for (let name in this.runningPlugins) {
			var plugin = this.runningPlugins[name]

			if (!_plugins[name]) {
				if (plugin.stop)
					plugin.stop()
				delete this.runningPlugins[name]
			} else
				if (plugin.update)
					plugin.update()
		}
	}

	componentWillMount() {
		this.update(this.props)
	}

	componentWillReceiveProps(props) {
		this.update(props)
	}

	componentWillUnmount() {
		for (let name in this.runningPlugins) {
			var plugin = this.runningPlugins[name]
				if (plugin.stop)
					plugin.stop()
		}
	}

	render() {
		return <div>{this.props.children}</div>
	}
}

Reducer.defaultProps = {
	plugins: {}
}

Reducer.contextTypes = {
	modulatorContext: React.PropTypes.any
}

Reducer.childContextTypes = {
	modulatorContext: React.PropTypes.any.isRequired
}