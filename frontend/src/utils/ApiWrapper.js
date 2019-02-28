import axios from 'axios'
import BACKEND_URL from './ApiConfig'

//import { BACKEND_KEY } from '../keys'

export const getDocuments = (userID, status) => {
  return axios
    .get(
      BACKEND_URL +
        '/search/documents?userID=' +
        userID +
        '&status=' +
        status /* + '&key=' + BACKEND_KEY */
    )
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getDocumentsByName = (fileName, docClass) => {
  return axios
    .get(
      BACKEND_URL + '/search/documents?name=' + fileName + '&docClass=' + docClass
    ) /* + '&key=' + BACKEND_KEY )*/
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getAllDocuments = () => {
  let requestString = BACKEND_URL + '/documents'
  return axios
    .get(requestString)
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

/* export const getIncompleteGames = () => {
  let requestString = BACKEND_URL + '/games/incomplete?key=' + BACKEND_KEY
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.games
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const sendFile = file => {
  let data = new FormData()
  data.append('file', file)
  data.set('key', BACKEND_KEY)

  return axios
    .post(BACKEND_URL + '/games', data)
    .then(response => {
      return {
        type: 'UPLOAD_FILE_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPLOAD_FILE_FAIL',
        error
      }
    })
}

export const editGame = (gameId, description, image) => {
  let data = new FormData()
  data.set('key', BACKEND_KEY)
  data.append('description', description)
  data.append('image', image)
  let requestString = BACKEND_URL + '/games/' + gameId
  return axios
    .put(requestString, data)
    .then(response => {
      return {
        type: 'UPLOAD_FILE_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPLOAD_FILE_FAIL',
        error
      }
    })
}

export const getUpdates = () => {
  let requestString = BACKEND_URL + '/updates?key=' + BACKEND_KEY
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.updates
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
} */
