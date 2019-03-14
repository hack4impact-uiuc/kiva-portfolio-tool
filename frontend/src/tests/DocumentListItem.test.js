import React from 'react'
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
})
