const SET_USER_TYPE = 'user/set_user_type'

const initialState = {
  isPM: false
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_TYPE:
      return {
        ...state,
        isPM: action.value
      }
    default:
      return state
  }
}

export const setUserType = value => ({
  type: SET_USER_TYPE,
  value
})
