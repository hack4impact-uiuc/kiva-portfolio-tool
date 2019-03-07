/*
EXAMPLE CODE
*/

//import { ADMIN_KEY } from '../../keys'

const LOGIN = 'auth/login'
const CHECK = 'auth/check'
const LOAD = 'auth/begin_loading'
const LOAD_UPDATES = 'auth/load_updates' 

const initialState = {
  verified: false,
  isPM: false,
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
    case CHECK:
      return {
        ...state,
        isPM: action.value
      }
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

export const check = value => ({
  type: CHECK,
  value
})

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
