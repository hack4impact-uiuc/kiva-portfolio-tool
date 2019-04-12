const SET_USER_TYPE = 'user/set_user_type'
const UPDATE_DOCUMENTS = 'user/update_documents'
const LOAD = 'user/load'
const UPDATE_MESSAGES = 'user/update_messages'
const UPDATE_INFORMATION = 'user/update_information'

const initialState = {
  isPM: false,
  documents: [],
  messages: [],
  information: [],
  loading: false
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_TYPE:
      return {
        ...state,
        isPM: action.value
      }
    case UPDATE_DOCUMENTS:
      return {
        ...state,
        documents: action.value
      }
    case LOAD:
      return {
        ...state,
        loading: action.value
      }
    case UPDATE_MESSAGES:
      return {
        ...state,
        messages: action.value
      }
    case UPDATE_INFORMATION:
      return {
        ...state,
        information: action.value
      }
    default:
      return state
  }
}

export const setUserType = value => ({
  type: SET_USER_TYPE,
  value
})

export const updateDocuments = value => ({
  type: UPDATE_DOCUMENTS,
  value
})

export const updateMessages = value => ({
  type: UPDATE_MESSAGES,
  value
})

export const updateInformation = value => ({
  type: UPDATE_INFORMATION,
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
