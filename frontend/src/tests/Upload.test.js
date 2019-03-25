import React from 'react'
import Upload from '../components/Upload'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('Upload renders correctly', () => {
  const component = shallow(<Upload />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
