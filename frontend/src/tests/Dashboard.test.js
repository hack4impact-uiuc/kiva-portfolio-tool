import React from 'react'
import { Dashboard } from '../components/Dashboard.js'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('Basic whole app rendering with snapshot', () => {
  // pass in the store directly and shallow render
  // shallow render creates the component one level deep and does not instantiate child components
  // derived from https://reactjs.org/docs/shallow-renderer.html and the above medium article
  // shallow comes from enzyme testing library, must be used for connected components (those with redux)
  const component = shallow(<Dashboard />)

  // change react component into pure javascript to compare to snapshot
  // checks if the component is the same as the snapshot (nothing unexpected happened)
  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
