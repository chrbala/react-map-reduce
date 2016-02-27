import { Mapper, Reducer } from '/src/index'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import keyevent from './keyevent'
import keymap from './keymap'

function displayPressedKeys() {
	var { keymap } = this.context
	var children = []

	for (var key in keymap)
		children.push(<p>{key}</p>)

	if (!children.length)
		children = <p>No keys are being pressed! Try pressing more than one at once.</p>

	return { children }
}

displayPressedKeys.contextTypes = {
	keymap: true
}

class App extends Component {
	render() {
		return (
			<Reducer plugins={{keyevent}}>
				<Reducer plugins={{keymap}}>
					<Mapper map={displayPressedKeys}>
						<div />
					</Mapper>
				</Reducer>
			</Reducer>
		)
	}
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)