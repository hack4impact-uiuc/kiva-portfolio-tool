import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import Example from '../components/Example'

test('Example should render passed props as content body and respond to callback props', () => {
  // jest mock function that stores some metadata about the function/function calls
  const markTodoDone = jest.fn()
  const removeItem = jest.fn()

  // create fake data and create component for testing
  const item = { index: 3, value: 'Fill Gas', done: false }
  let itemIndex = 5
  const { getByTestId } = render(
    <Example item={item} index={itemIndex} markTodoDone={markTodoDone} removeItem={removeItem} />
  )

  // test ids/fields of components (doesn't have to be getByTestId, there are other functions to get what you need)
  expect(getByTestId('todoItem3').textContent).toBe('Fill Gas')

  // trigger event and check mock function metadata
  fireEvent.click(getByTestId('markAsCompleted'))
  expect(markTodoDone).toBeCalledWith(itemIndex)
  expect(markTodoDone).toHaveBeenCalledTimes(1)

  // same thing as above, just with another component
  fireEvent.click(getByTestId('markAsDeleted'))
  expect(removeItem).toBeCalledWith(itemIndex)
  expect(removeItem).toHaveBeenCalledTimes(1)
})
