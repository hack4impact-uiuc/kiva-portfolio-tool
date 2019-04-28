import React from 'react'
import {NavBar} from '../components/NavBar'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import MockData from '../utils/MockData'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('NavBar renders correctly', () => {
  const component = shallow(<NavBar />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
