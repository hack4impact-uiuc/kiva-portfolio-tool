import axios from 'axios'
import BACKEND_URL from './ApiConfig'
import { getCookie } from './cookie'

//import { BACKEND_KEY } from '../keys'

export const register = (email, password, questionIdx, answer, role) => {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  data.append('securityQuestionAnswer', answer)
  data.append('questionIdx', questionIdx)
  data.append('role', role)
  data.append('answer', answer)
  return axios
    .post(BACKEND_URL + '/register', data)
    .then(response => {
      return {
        type: 'REGISTER_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'REGISTER_FAIL',
        error
      }
    })
}

export const login = (email, password) => {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  return axios
    .post(BACKEND_URL + '/login', data)
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const verify = (emailInput, passwordInput) => {
  return axios
    .post(BACKEND_URL + '/verify', {
      headers: {
        'Content-Type': 'application/json',
        token: getCookie('token')
      }
    })
    .then(response => {
      return {
        type: 'REGISTER_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'REGISTER_FAIL',
        error
      }
    })
}

export const getSecurityQuestions = () => {
  return axios
    .get(BACKEND_URL + '/getSecurityQuestions', {
      headers: {
        'Content-Type': 'application/json',
        token: getCookie('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const setSecurityQuestion = (questionIdx, answer, password) => {
  let data = new FormData()
  data.append('questionIdx', questionIdx)
  data.append('answer', answer)
  data.append('password', password)
  return axios
    .post(BACKEND_URL + '/addSecurityQuestionAnswer', data)
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const getSecurityQuestionForUser = email => {
  let data = new FormData()
  data.append('email', email)
  return axios
    .post(BACKEND_URL + '/getSecurityQuestionForUser', data)
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const submitSecurityQuestionAnswer = (email, answer, questionIdx) => {
  let data = new FormData()
  data.append('email', email)
  data.append('answer', answer)
  data.append('questionIdx', questionIdx)
  return axios
    .post(BACKEND_URL + '/forgotPassword', data)
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const resetPassword = (email, answer, pin, password) => {
  let data = new FormData()
  data.append('email', email)
  data.append('answer', answer)
  data.append('pin', pin)
  data.append('password', password)
  return axios
    .post(BACKEND_URL + '/resetPassword', data)
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const changePassword = (currentPassword, newPassword) => {
  let data = new FormData()
  data.append('currentPassword', currentPassword)
  data.append('newPassword', newPassword)
  return axios
    .post(BACKEND_URL + '/changePassword', data, {
      headers: {
        'Content-Type': 'application/json',
        token: getCookie('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const verifyPIN = (email, pin) => {
  let data = new FormData()
  data.append('email', email)
  data.append('pin', pin)
  return axios
    .post(BACKEND_URL + '/verifyEmail', data, {
      headers: {
        'Content-Type': 'application/json',
        token: getCookie('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

export const resendPIN = () => {
  return axios
    .post(BACKEND_URL + '/resendVerificaitonEmail', {
      headers: {
        'Content-Type': 'application/json',
        token: getCookie('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'LOGIN_FAIL',
        error
      }
    })
}

//import { BACKEND_KEY } from '../keys'

export const getAllPMs = () => {
  let requestString = BACKEND_URL + '/portfolio_manager'
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.portfolio_manager
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

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

export const getFPNameByID = id => {
  let requestString = BACKEND_URL + '/field_partner/' + id
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.field_partner.org_name
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getDocumentsByUser = userID => {
  let requestString = BACKEND_URL + '/document?uid=' + userID
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

export const createDocuments = (userID, docClassIDs, dueDate) => {
  let requestString = BACKEND_URL + '/document/create'
  let data = new FormData()
  data.append('userID', userID)
  data.append('status', 'Missing')
  data.append('docClassIDs', docClassIDs)
  data.append('dueDate', dueDate)
  return axios
    .post(requestString, data)
    .then(response => {
      return {
        type: 'CREATE_DOCUMENTS_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_DOCUMENTS_FAIL',
        error
      }
    })
}

export const getAllMessages = () => {
  // get notifications received by target user
  return [
    {
      name: 'PM',
      time: '4/12/18',
      description: 'Rejected Strategic Plan. This also tests for activity overflow.'
    },
    { name: 'PM', time: '4/12/19', description: 'Rejected Annual Plan' },
    { name: 'PM', time: '4/12/17', description: 'Approved Financial Projections' },
    { name: 'PM', time: '4/12/17', description: 'Approved Organizational Chart' }
  ]
}

export const getAllInformation = () => {
  // get information received by target user
  return [
    'Special instructions about the format of specific requiremeents or general information about the review process here.'
  ]
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

export const getPartnersByStatus = app_status => {
  let requestString = BACKEND_URL + '/field_partner/status/' + app_status
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

export const createFieldPartner = (org_name, email, pm_id) => {
  let requestString = BACKEND_URL + '/field_partner/new'
  let data = new FormData()
  data.append('org_name', org_name)
  data.append('email', email)
  data.append('pm_id', pm_id)
  data.append('app_status', 'New Partner')
  return axios
    .post(requestString, data)
    .then(response => {
      return {
        type: 'CREATE_FP_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_FP_FAIL',
        error
      }
    })
}

export const finishFieldPartner = id => {
  let requestString = BACKEND_URL + '/field_partner/update/' + id
  let data = new FormData()
  data.append('app_status', 'Complete')
  return axios
    .put(requestString, data)
    .then(response => {
      return {
        type: 'UPDATE_FP_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPDATE_FP_FAIL',
        error
      }
    })
}

export const deleteDocument = id => {
  let requestString = BACKEND_URL + '/document/delete/' + id
  return axios
    .delete(requestString)
    .then(response => {
      return {
        type: 'DELETE_DOCUMENT_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'DELETE_DOCUMENT_FAIL',
        error
      }
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
