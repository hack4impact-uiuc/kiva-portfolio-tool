import React from 'react'
<<<<<<< HEAD
import { getByText, render, fireEvent } from 'react-testing-library'
import DocumentListItem from '../components/DocumentListItem'
import MockData from '../utils/MockData'

test('DocumentListItem should render passed props as content body', () => {

  // jest mock function that stores some metadata about the function/function calls
  const handleUploadClick = jest.fn()
  const handleDownloadClick = jest.fn()
  // create fake data and create component for testing
  const document = {
    '_id': 1,
    'fileName': 'tax.pdf',
    'docClass': 'Tax Document'
  }

  const { getByTestId } = render(
    <DocumentListItem document={document}/>
  )

  expect(getByTestId('docClass').textContent).toBe('Tax Document')
  expect(getByTestId('fileName').textContent).toBe('tax.pdf')
  fireEvent.click(getByText('UPLOAD'))
  expect(handleUploadClick).toHaveBeenCalled()

  fireEvent.click(getByText('DOWNLOAD'))
  expect(handleDownloadClick).toHaveBeenCalled()
=======
import DocumentListItem from '../components/DocumentListItem'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import MockData from '../utils/MockData'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('DocumentListItem renders correctly', () => {
  const component = shallow(<DocumentListItem document={MockData.missing[0]}/>)

  let tree = shallowToJson(component)
  expect(tree).toMatchSnapshot()
>>>>>>> jest-bugfix
})
