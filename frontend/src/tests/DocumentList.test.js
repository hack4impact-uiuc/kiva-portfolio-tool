import React from 'react'
<<<<<<< HEAD
import { render, fireEvent } from 'react-testing-library'
import DocumentList from '../components/DocumentList'
import MockData from '../utils/MockData'

test('DocumentList should render passed props as content body', () => {

  // create fake data and create component for testing
  const documents = MockData.approved
  let status = "Approved"

  const { getByTestId } = render(
    <DocumentList documents={documents} status={status}/>
  )

  // test ids/fields of components (doesn't have to be getByTestId, there are other functions to get what you need)
  expect(getByTestId('todoItem3').textContent).toBe('Fill Gas')
=======
import DocumentList from '../components/DocumentList'
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
>>>>>>> jest-bugfix
})
