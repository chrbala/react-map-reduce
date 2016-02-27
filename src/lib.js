import Plugin from './Plugin'

const mappedAnd = (obj1, obj2, onError) => {
	var mapped = {}

	if (!obj1) {
		onError({type: 'missing1', data: Object.keys(obj2)})
		return mapped
	}
	
	for (var key in obj2)
		if (key in obj1)
			mapped[key] = obj1[key]
		else
			onError && onError({type: 'key', data: key})

	return mapped
}

export const getPluginType = object => {
	if (object.constructor !== Function)
		return 'instance'
	if (Object.getPrototypeOf(object) === Plugin)
		return 'constructor'
	return 'stateless'
}

const getPluginProperties = plugin => {
	var type = getPluginType(plugin)
	switch (type) {
		case 'instance':
			return plugin.constructor
		case 'constructor':
			return plugin.constructor
		case 'stateless':
			return plugin
	}
}

export const getPluginNamespace = plugin => {
	var { namespace, name = (namespace || 'nameless plugin') } = getPluginProperties(plugin)
	if (!namespace)
		throw new Error(`Plugins require a namespace. Check ${name}.`)
	return namespace
}

export const getContext = ({plugin, modulatorContext, contextTypes}) => {
	var handleError = ({type, data}) => {
		var { namespace, name = namespace } = getPluginProperties(plugin)

		if (type == 'key')
			throw new Error(`${name} requires access to ${data}.`)
		else if (type == 'missing1')
			throw new Error(`${name} requires access to ${data.join(', ')}, but was found at the top ModulatorReducer level.`)
	}

	return mappedAnd(modulatorContext, contextTypes, handleError)
}

export const getProps = ({defaultProps, actualProps}) => {
	if (typeof defaultProps == 'object' || typeof actualProps == 'object')
		return {...defaultProps, ...actualProps}
	return actualProps === undefined ? defaultProps : actualProps
}

export const getStatelessScope = ({plugin, actualProps, modulatorContext, contextTypes, defaultProps}) => ({
	get context() {
		try {
			return getContext({plugin, modulatorContext, contextTypes})
		} catch (e) {
			console.error(e)
		}
	},
	get props() {
		return getProps({ defaultProps, actualProps })
	}
})