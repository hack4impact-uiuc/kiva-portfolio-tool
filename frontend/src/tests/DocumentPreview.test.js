import React from 'react'
import { DocumentPreview } from '../components/DocumentPreview'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import MockData from '../utils/MockData'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('DocumentPreview renders correctly', () => {
  const component = shallow(<DocumentPreview document={MockData.missing[0]} />)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
})
