import axios from 'axios'
import BACKEND_URL from './ApiConfig'
import MockData from './MockData'

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

export const getAllMessages = () => {
  // get notifications received by target user
  return [
    { name: 'joe', time: '4/12/18', description: 'GO DO SHIT' },
    { name: 'schmoe', time: '4/12/19', description: 'DO SOME OTHER CRAP' },
    { name: 'bro', time: '4/12/17', description: 'OOF' }
  ]
}

export const getAllInformation = () => {
  // get notifications received by target user
  return ['I need you to not work on IST and get in the documents asap']
}

export const getAllDocumentClasses = () => {
  return ['WakaWaka', 'MakaMaka', 'BoomShakaLaka']
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

export const sendFile = (file, file_name) => {
  let data = new FormData()
  data.append('file', file)
  data.append('file_name', file_name)
  return axios
    .post(BACKEND_URL + '/box/file', data)
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
