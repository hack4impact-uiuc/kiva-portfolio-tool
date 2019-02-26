
const initialState = {
	verified: false,
	loading: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        verified: action.value
      }
    case LOAD:
      return {
        ...state,
        loading: action.value
      }
    default:
      return state
  }
}

export const login = value => ({
  type: LOGIN,
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