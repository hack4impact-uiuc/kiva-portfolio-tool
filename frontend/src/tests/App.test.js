import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

test('Basic whole app rendering with snapshot', () => {
  // create component to be tested
  const component = renderer.create(<App />)

  // change react component into pure javascript to compare to snapshot
  // checks if the component is the same as the snapshot (nothing unexpected happened)
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
