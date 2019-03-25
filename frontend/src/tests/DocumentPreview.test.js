import React from 'react'
<<<<<<< HEAD
import { render, fireEvent } from 'react-testing-library'
import DocumentPreview from '../components/DocumentPreview'

test('DocumentList should render passed props as content body', () => {

  // create fake data and create component for testing
  const documents = {
    
  }

  const { getByTestId } = render(
    <DocumentPreview documents={documents}/>
  )

  // test ids/fields of components (doesn't have to be getByTestId, there are other functions to get what you need)
  expect(getByTestId('status').textContent).toBe('Fill Gas')
})
=======
import DocumentPreview from '../components/DocumentPreview'
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
>>>>>>> jest-bugfix
