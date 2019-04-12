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
      return response.data.result.documents
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getDocumentsByName = (fileName, docClassID) => {
  return axios
    .get(
      BACKEND_URL + '/search/documents?name=' + fileName + '&docClassID=' + docClassID
    ) /* + '&key=' + BACKEND_KEY )*/
    .then(response => {
      return response.data.result.documents
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getAllDocuments = () => {
  let requestString = BACKEND_URL + '/document'
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.documents
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getAccessToken = () => {
  let requestString = BACKEND_URL + '/box/token'
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.access_token
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const downloadDocument = id => {
  let requestString = BACKEND_URL + '/box/download?file_id' + id
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.output
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const updateDocumentStatus = (id, status) => {
  return axios
    .put(BACKEND_URL + '/document/update/' + id + '/' + status)
    .then(response => {
      return {
        type: 'UPDATE_DOC_STATUS_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPDATE_DOC_STATUS_FAIL',
        error
      }
    })
}

export const sendFile = (file, file_name, docClassID) => {
  console.log(file)
  console.log(file_name)
  var data = new FormData()
  //fileForm.append('file', file)
  //var data = {'userID': 1, 'status': 'Pending', 'docClassID': 123, 'file': fileForm, fileName: file_name}
  data.append('file', file)
  data.append('fileName', file_name)
  data.append('userID', 1)
  data.append('status', 'Pending')
  data.append('docClassID', docClassID)
  console.log(data)
  //console.log(data['file'])
  return axios
    .post(BACKEND_URL + '/document/new', data)
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
