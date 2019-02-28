import { resultsState } from './modules/results'

const STATE_STORAGE = 'childs_play_state'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STATE_STORAGE)
    if (serializedState === undefined || serializedState === null) {
      localStorage.setItem(STATE_STORAGE, resultsState)
      return { results: resultsState }
    }
    let savedState = JSON.parse(serializedState)
    resultsState.searches = savedState.searches
    return { results: resultsState }
  } catch (err) {
    return { results: resultsState }
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STATE_STORAGE, serializedState)
  } catch (err) {
    console.log('Unable to save data to Local Storage')
  }
}
