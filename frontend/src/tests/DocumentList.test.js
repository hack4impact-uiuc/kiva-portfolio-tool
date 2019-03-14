import React from 'react'
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
})
