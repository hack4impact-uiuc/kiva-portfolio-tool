// @flow
const SAVE_SEARCH = 'results/SAVE_SEARCH'
const UPDATE_RESULTS = 'results/UPDATE_RESULTS'
const UPDATE_RESULTS_ALL = 'results/UPDATE_RESULTS_ALL'
const GET_SAVED_SEARCH = 'results/GET_SAVED_SEARCH'
const EDIT_GAME_STATE = 'results/EDIT_GAME_STATE'
const UPDATE_CONSOLE = 'results/UPDATE_CONSOLE'
const UPDATE_TAB = 'results/UPDATE_TAB'
const LOAD = 'results/LOAD'
const DELETE_SEARCH = 'results/DELETE_SEARCH'

export const resultsState = {
  currentConsole: '',
  searches: [],
  games: {},
  query: {},
  loading: false,
  activeTab: '1',
  allGames: false
}

export default function reducer(state = resultsState, action) {
  switch (action.type) {
    case UPDATE_CONSOLE:
      return {
        ...state,
        currentConsole: action.value
      }
    case UPDATE_RESULTS:
      return {
        ...state,
        games: action.value.games,
        query: action.value.query,
        activeTab: '1',
        allGames: false
      }
    case UPDATE_RESULTS_ALL:
      return {
        ...state,
        games: action.value.games,
        query: action.value.query,
        activeTab: '1',
        allGames: true
      }
    case SAVE_SEARCH:
      return {
        ...state,
        searches: state.searches.concat({
          value: action.payload.value,
          searchResults: action.payload.searchResults
        })
      }
    case GET_SAVED_SEARCH:
      return {
        ...state,
        games: state.searches.find(({ value }) => value === action.value).searchResults.results,
        query: state.searches.find(({ value }) => value === action.value).searchResults.query,
        currentConsole: Object.keys(
          state.searches.find(({ value }) => value === action.value).searchResults.results
        )[0]
      }

    case EDIT_GAME_STATE:
      return {
        ...state,
        games: {
          ...state.games,
          [state.currentConsole]: state.games[state.currentConsole].map(
            item =>
              item.id === action.payload.gameId
                ? {
                    ...item,
                    description: action.payload.newDescription,
                    image: action.payload.newImageURL
                  }
                : item
          )
        }
      }
    case UPDATE_TAB:
      return {
        ...state,
        activeTab: action.value.activeTab
      }
    case LOAD:
      return {
        ...state,
        loading: action.value
      }
    case DELETE_SEARCH:
      return {
        ...state,
        searches: state.searches.filter(search => {
          return search.value !== action.value
        })
      }
    default:
      return state
  }
}

export const saveSearch = (value, searchResults) => ({
  type: SAVE_SEARCH,
  payload: {
    value,
    searchResults
  }
})

export const updateResults = value => ({
  type: UPDATE_RESULTS,
  value
})

export const updateResultsAll = value => ({
  type: UPDATE_RESULTS_ALL,
  value
})

export const getSavedSearch = value => ({
  type: GET_SAVED_SEARCH,
  value
})

export const editGameState = (gameConsole, gameId, newDescription, newImageURL) => ({
  type: EDIT_GAME_STATE,
  payload: {
    gameConsole,
    gameId,
    newDescription,
    newImageURL
  }
})

export const updateConsole = value => ({
  type: UPDATE_CONSOLE,
  value
})

export const updateTab = value => ({
  type: UPDATE_TAB,
  value
})

export const beginLoading = () => ({
  type: LOAD,
  value: true
})

export const endLoading = () => ({
  type: LOAD,
  value: false
})

export const deleteSearch = value => ({
  type: DELETE_SEARCH,
  value
})
