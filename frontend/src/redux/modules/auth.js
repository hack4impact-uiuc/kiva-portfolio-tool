
const LOGIN = 'auth/login'
const LOAD = 'auth/begin_loading'
const LOAD_UPDATES = 'auth/load_updates' 

const initialState = {
  verified: false,
  // May need for later
  /* loading: false
  updates: {} */
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        verified: action.value
      }

    // May need Load for later
    /* case LOAD:
      return {
        ...state,
        loading: action.value
      }
    case LOAD_UPDATES:
      return {
        ...state,
        updates: action.value
      } */
    default:
      return state
  }
}

export const login = value => ({
  type: LOGIN,
  value
})

// May need for later
/* export const loadUpdates = value => ({
  type: LOAD_UPDATES,
  value
})

export const beginLoading = () => ({
  type: LOAD,
  value: true
})

export const endLoading = () => ({
  type: LOAD,
  value: false
}) */
