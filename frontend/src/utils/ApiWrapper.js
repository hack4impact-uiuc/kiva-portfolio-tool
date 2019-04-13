import axios from 'axios'
import BACKEND_URL from './ApiConfig'
import MockData from './MockData'

//import { BACKEND_KEY } from '../keys'

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
  return ['joe', 'schmoe', 'bro']
}

export const getAllPartners = () => {
  return [
    {
      name: 'Waluigi',
      duedate: 1.23,
      status: 'Active',
      documents: {
        Put: 'Pending',
        Me: 'Approved',
        In: 'Missing',
        Smash: 'Rejected',
        Ultimate: 'Approved'
      }
    },
    {
      name: 'Mario',
      duedate: 1.423,
      status: 'Active',
      documents: {
        Already: 'Approved',
        In: 'Missing',
        Smash: 'Missing',
        Ultimate: 'Approved'
      }
    },
    {
      name: 'Peach',
      duedate: 12534.0,
      status: 'Dormant',
      documents: {
        Already: 'Rejected',
        In: 'Rejected',
        Smash: 'Missing',
        Ultimate: 'Approved'
      }
    }
  ]
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
  var data = new FormData()
  data.append('docID', id)
  data.append('status', status)
  return axios
    .put(BACKEND_URL + '/document/status', data)
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

export const sendFile = (file, file_name, docID) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)
  data.append('docID', docID)
  return axios
    .put(BACKEND_URL + '/document/upload', data)
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
