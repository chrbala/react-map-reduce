import { Mapper } from '/src/index'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

function multiplyChildren({children}) {
	var newChildren = React.Children.map(children, child => {
		var array = []
		var remaining = this.props.count
		while (remaining--)
			array.push(child)

		return array
	})

	return { children: newChildren }
}

class App extends Component {
	constructor() {
		super()
		this.state = { count: 1 }
	}

	render() {
		return (
			<div>
				<button onClick={() => this.setState({count: this.state.count + 1})}>Increase</button>
				<Mapper map={multiplyChildren} count={this.state.count}>
					<p>Hello </p>
				</Mapper>
			</div>
		)
	}
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)