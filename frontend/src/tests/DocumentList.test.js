import React from 'react'
import { DocumentList } from '../components/Dashboard'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import MockData from '../utils/MockData'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('DocumentList renders correctly when there are no documents', () => {
  const component = shallow(<DocumentList />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})

test('DocumentList renders correctly with documents', () => {
  const component = shallow(<DocumentList documents={MockData.missing} />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
