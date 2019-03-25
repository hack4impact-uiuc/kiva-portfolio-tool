import React from 'react'
import DocumentListItem from '../components/DocumentListItem'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import MockData from '../utils/MockData'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('DocumentListItem renders correctly', () => {
  const component = shallow(<DocumentListItem document={MockData.missing[0]} />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
