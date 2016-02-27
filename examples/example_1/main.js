import { Mapper, Reducer } from '/src/index'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import keyevent from './keyevent'

function displayEvent() {
	var { keyevent } = this.context
	if (!keyevent)
		return

	var { type, code } = this.context.keyevent
	var text = `${type} ${code}`
	return { text }
}

displayEvent.contextTypes = {
	keyevent: true
}

const Text = ({text}) =>
	<div>{text}</div>

class App extends Component {
	render() {
		return (
			<Reducer plugins={{keyevent}}>
				<Mapper map={displayEvent}>
					<Text text="no key pressed yet! try pressing a key." />
				</Mapper>
			</Reducer>
		)
	}
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)