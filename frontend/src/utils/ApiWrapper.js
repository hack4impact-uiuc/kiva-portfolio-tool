import axios from 'axios'
import BACKEND_URL from './ApiConfig'

//import { BACKEND_KEY } from '../keys'

export const getAllDocumentClasses = () => {
  let requestString = BACKEND_URL + '/document_class'
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.document_class
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
  // get information received by target user
  return ['I need you to not work on IST and get in the documents asap']
}

export const getPartnersByPM = pm_id => {
  let requestString = BACKEND_URL + '/field_partner/pm/' + pm_id
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.field_partner
    })
    .catch(error => {
      return {
        type: 'GET_PARTNERS_FAIL',
        error
      }
    })
}

export const getAllPartners = () => {
  let requestString = BACKEND_URL + '/field_partner'
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.field_partner
    })
    .catch(error => {
      return {
        type: 'GET_PARTNERS_FAIL',
        error
      }
    })
}

/*
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
*/

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
  data.append('status', status)
  return axios
    .put(BACKEND_URL + '/document/status/' + id, data)
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

export const uploadDocument = (file, file_name, docID) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)
  return axios
    .put(BACKEND_URL + '/document/upload/' + docID, data)
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

export const createDocumentClass = (name, description, file, file_name) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)
  data.append('name', name)
  data.append('description', description)
  return axios
    .post(BACKEND_URL + '/document_class/new', data)
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

export const updateDocumentClass = (id, name, description, file, file_name) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)
  data.append('name', name)
  data.append('description', description)
  return axios
    .put(BACKEND_URL + '/document_class/update/' + id, data)
    .then(response => {
      return {
        type: 'UPDATE_DOCUMENT_CLASS_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPDATE_DOCUMENT_CLASS_FAIL',
        error
      }
    })
}

export const deleteDocumentClass = id => {
  return axios
    .delete(BACKEND_URL + '/document_class/delete/' + id)
    .then(response => {
      return {
        type: 'DELETE_DOCUMENT_CLASS_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'DELETE_DOCUMENT_CLASS_FAIL',
        error
      }
    })
}
