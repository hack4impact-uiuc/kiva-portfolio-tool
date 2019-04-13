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
