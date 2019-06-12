const SET_USER_TYPE = 'user/set_user_type'
const UPDATE_DOCUMENTS = 'user/update_documents'
const UPDATE_DOCUMENT_CLASSES = 'user/update_document_classes'
const UPDATE_MESSAGES = 'user/update_messages'
const UPDATE_INSTRUCTIONS = 'user/update_instructions'
const LOAD = 'user/begin_loading'
const UPDATE_LANGUAGE = 'user/update_language'

const initialState = {
  isPM: true,
  documents: [],
  documentClasses: [],
  messages: [],
  instructions: '',
  loading: false,
  language: 'English'
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
    case UPDATE_DOCUMENT_CLASSES:
      return {
        ...state,
        documentClasses: action.value
      }
    case UPDATE_MESSAGES:
      return {
        ...state,
        messages: action.value
      }
    case UPDATE_INSTRUCTIONS:
      return {
        ...state,
        instructions: action.value
      }
    case LOAD:
      return {
        ...state,
        loading: action.value
      }
    case UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.value
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

export const updateDocumentClasses = value => ({
  type: UPDATE_DOCUMENT_CLASSES,
  value
})

export const updateMessages = value => ({
  type: UPDATE_MESSAGES,
  value
})

export const updateInstructions = value => ({
  type: UPDATE_INSTRUCTIONS,
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

export const updateLanguage = value => ({
  type: UPDATE_LANGUAGE,
  value
})
