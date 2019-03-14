import React from 'react'
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
