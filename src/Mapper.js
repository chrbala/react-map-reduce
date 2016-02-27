import React, { Component } from 'react'

import { getContext, getStatelessScope } from './lib'

export default class Mapper extends Component {
	reduce(child) {
		var { modulatorContext } = this.context
		var { map: plugin, ...actualProps } = this.props
		if (!plugin)
			return 

		var { contextTypes, defaultProps } = plugin
		var scope = getStatelessScope({plugin, actualProps, modulatorContext, contextTypes, defaultProps})

		return plugin.call(scope, child.props)
	}

	render() {
		return <div>{React.Children.map(this.props.children, m => 
			React.cloneElement(m, this.reduce(m))
		)}</div>
	}
}

Mapper.propTypes = {
	map: React.PropTypes.any.isRequired
}

Mapper.contextTypes = {
	modulatorContext: React.PropTypes.any
}