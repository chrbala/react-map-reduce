# react-map-reduce

## What does it do?

In short, react-map-reduce calculates derived data from props, then applies the derived data to an unrelated React component. React-map-reduce is made up of three parts:

* Reducer: A reducer calculates derived data from plugins and passes the data on to other reducers. Reducers use plugins to derive data.
* Plugins: Plugins derive data as a function of props, other derived data, and their own internal state.
* Mapper: Mappers are the output of react-map-reduce. They set their children's props as a function of their own props, the child's props and derived data. They do not contain internal state.

## Why would I need it?

React-map-reduce was developed as a way to easily change a component's props as a result of user input. This is particularly helpful when the way the data is being derived changes based on user input.

React-map-reduce is also meant as a way to make react components more declarative in nature, separating the data processing logic from the data itself and UI.

## How do I use it?

The below examples are meant to be a minimal library reference. For more complete examples, see the examples folder by running ``npm start`` and navigating to [http://localhost:3000/examples/](http://localhost:3000/examples/).

### Reducer

A reducer is a React component that functions via plugins - without plugins, a reducer doesn't do anything. The interface is pretty simple:

```javascript
<Reducer plugins={{somePlugin, otherPlugin}} somePlugin={pluginOptions}>
``` 
*In the above example, the reducer is using two plugins with the names 'somePlugin' and 'otherPlugin'. somePlugin is accepting an options object called pluginOptions. The plugin's options would then be accessed inside the plugin via this.props.*

Note that the plugins prop is an object where each key is a single plugin.

Reducers can be put anywhere in the component tree: they can contain and be contained by ordinary UI components. A reducer's plugins can access the derived data from reducers higher in the component tree - but not those below it.

### Plugins

*The plugin interface was modeled roughly after React, but it is not React.*

Plugins have access to the derived data in plugins at higher levels in the component tree. They access this via this.context. Like in React, context must be specified via contextTypes to be accessed.

Plugins also have access to a subset of the Reducer's plugin as this.props. This is provided as shown in the Reducer section above.

#### Stateful plugins

```javascript
class keyevent extends Plugin {
  constructor() {
    super()
    this.event = null
  }

  handleEvent(event) {
    this.event = event
    this.forceUpdate()  // forceUpdate updates the plugin's Reducer component
  }

  // Required if stop is implemented. Executes when the plugin is attached to the Reducer.
  start() {
    window.onkeydown = ::this.handleEvent
    window.onkeyup = ::this.handleEvent
  }
  
  // Optional. Executes when the plugin's Reducer changes props.
  update() { }

  // Required if start is implemented. Executes when the plugin is detached 
  // from the reducer or when the reducer is unmounted.
  stop() {
    window.onkeydown = null
    window.onkeyup = null
  }

  // Required. The result is passed down to other Reducers and Mappers in 
  // the component tree
  reduce() {
    return this.event
  }
}

// A plugin's dependents access the plugin's data via the plugin's namespace. 
// Namespaces are required properties.
// Namespaces are shared across all plugins, so be sure to name them wisely!
keyevent.namespace = 'keyevent'
```

#### Stateless plugins

Stateless plugins are functions of props and context. They are equivalent to simply the 'reduce' method in a stateful plugin. The return value of the plugin gets passed along to Reducers and Mappers further down the component tree.

*For the sake of a consistent API, stateless plugins still use the 'this' keyword to access context and props. Stateless plugins are, however, still pure functions without side effects. Do not try to attach things to 'this' in a stateless plugin.*

```javascript
// This plugin returns just the code from a keyevent.
function keycode() {
  var { code } = this.context.keyevent
  return code
}
```

#### Plugin settings
Plugin settings are attached to the stateless function itself in the case of a stateless function (shown below), or to the plugin prototype (in the case of a stateful prototype). 

```javascript
keycode.defaultProps = {
  someProp: 'someValue'
}

// contextTypes must be specified for access to context
// Simply mark required context as true - not propTypes like in React
keycode.contextTypes = {
  keyevent: true
}

keycode.namespace = 'keycode'

// Note that there is not currently propTypes support.

```

### Mappers
Mappers are the outputs of react-map-reduce. Like Reducers, they can contain and be contained by any component in the component tree. Mappers take a single function prop: map. Map is a function of context (this.context), its own props (this.props), and its children's props (argument).

*For the sake of a consistent API, map functions still use the 'this' keyword to access context and props. Stateless plugins are, however, still pure functions without side effects. Do not try to attach things to 'this' in a map function.*

```javascript
// The map function returns an object that is merged with each of the Reducer's children's
// actual props. Returning undefined will leave the children's props unchanged.
function displayKeyEvent(childProps) {
  var { keyevent } = this.context
  if (!keyevent)
    return

  var { type, code } = this.context.keyevent
  var text = `${type} ${code}`
  return { text }
}

displayKeyEvent.contextTypes = {
  keyevent: true
}

// in a React render()
<Reducer plugins={{keyevent}}>
  <Mapper map={displayKeyEvent}>
    <Text text="no key pressed yet! try pressing a key." />
  </Mapper>
</Reducer>
```

## Advanced usage
Mappers can modify the props for both other mappers and reducers. This would be useful mostly if you want to have a mapper or reducer act differently based on application state or user input.

## Roadmap

This is a new library, so there are some things that need to be thought out a bit.

* There should be better ES5 dev support and documentation.
* propTypes should be specified in Context, allowing for optional context use.
* This library has not been tested for server-side rendering.