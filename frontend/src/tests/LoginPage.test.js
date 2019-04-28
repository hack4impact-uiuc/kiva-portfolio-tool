import React from 'react'
import { LoginPage } from '../components/LoginPage'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('LoginPage renders correctly', () => {
  const component = shallow(<LoginPage />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
