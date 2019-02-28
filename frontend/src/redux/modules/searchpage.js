// @flow
const UPDATE_FIELD = 'searchpage/UPDATE_FIELD'
const UPDATE_IMAGE_STATE = 'searchpage/UPDATE_IMAGE_STATE'

export const searchState = {
  consoles: '',
  ageRange: '',
  symptoms: '',
  genders: '',
  nameSearchField: '',
  selectedSaveSearch: '',
  noImage: false
}

export default function reducer(state = searchState, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value
      }
    case UPDATE_IMAGE_STATE:
      return {
        ...state,
        noImage: !state.noImage
      }
    default:
      return state
  }
}

export const updateField = (field, value) => ({
  type: UPDATE_FIELD,
  payload: {
    field,
    value
  }
})

export const updateImageState = () => ({
  type: UPDATE_IMAGE_STATE
})
