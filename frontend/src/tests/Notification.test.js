import React from 'react'
import { Notification } from '../components/Notification'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('Notification renders correctly', () => {
  const component = shallow(<Notification />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
