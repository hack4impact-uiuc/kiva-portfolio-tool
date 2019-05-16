import axios from 'axios'
import BACKEND_URL from './ApiConfig'
import { getCookieFromBrowser, getCookie } from './cookie'

//import { BACKEND_KEY } from '../keys'

export const getAllPMs = () => {
  let requestString = BACKEND_URL + '/portfolio_manager'
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return response.data.result.portfolio_manager
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getUserRole = () => {
  let requestString = BACKEND_URL + '/getUser'
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return response.data.result.userRole
    })
    .catch(error => {
      return {
        type: 'GET_PARTNERS_FAIL',
        error
      }
    })
}

export const createFieldPartner = (org_name, email, pm_id) => {
  let requestString = BACKEND_URL + '/createFP'
  let data = new FormData()
  data.append('org_name', org_name)
  data.append('email', email)
  data.append('pm_id', pm_id)
  data.append('app_status', 'New Partner')
  return axios
    .post(requestString, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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

export const verify = () => {
  return axios
    .post(BACKEND_URL + '/verify', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      console.log(response)
      return {
        type: 'REGISTER_SUCCESS',
        response
      }
    })
    .catch(error => {
      console.log(error)
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
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
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
    .post(BACKEND_URL + '/addSecurityQuestionAnswer', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
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

export const getSecurityQuestionForUser = email => {
  let data = new FormData()
  data.append('email', email)
  return axios
    .post(BACKEND_URL + '/getSecurityQuestionForUser', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
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
      console.log('ERROR: ', error)
      return null
    })
}

export const resetPassword = (email, answer, pin, password) => {
  let data = new FormData()
  data.append('email', email)
  data.append('answer', answer)
  data.append('pin', pin)
  data.append('password', password)
  return axios
    .post(BACKEND_URL + '/resetPassword', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return {
        type: 'LOGIN_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const changePassword = (currentPassword, newPassword) => {
  let data = new FormData()
  data.append('currentPassword', currentPassword)
  data.append('newPassword', newPassword)
  return axios
    .post(BACKEND_URL + '/changePassword', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
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

export const verifyPIN = pin => {
  let data = new FormData()
  data.append('pin', pin)
  return axios
    .post(BACKEND_URL + '/verifyEmail', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
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
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
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

export const getAllDocumentClasses = () => {
  let requestString = BACKEND_URL + '/document_class'
  return axios
    .get(requestString, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
  return axios.get(requestString, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: getCookieFromBrowser('token')
    }
  })
}

export const getFPByID = id => {
  let requestString = BACKEND_URL + '/field_partner/' + id
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.field_partner
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const getAllMessages = (user_id, is_pm) => {
  // get notifications received by target user
  let requestString = BACKEND_URL + '/messages/'
  if (is_pm) {
    requestString = requestString + 'pm/' + user_id
  } else {
    requestString = requestString + 'fp/' + user_id
  }
  return axios
    .get(requestString)
    .then(response => {
      return response.data.result.messages
    })
    .catch(error => {
      return {
        type: 'GET_MESSAGES_BY_ID_FAIL',
        error
      }
    })
}

export const createMessage = (user_id, is_pm_id, to_fp, document_id, status) => {
  let requestString = BACKEND_URL + '/messages/new'
  let data = new FormData()

  if (is_pm_id) {
    data.append('pm_id', user_id)
  } else {
    data.append('fp_id', user_id)
  }

  data.append('to_fp', to_fp)
  data.append('doc_id', document_id)
  data.append('status', status)

  return axios
    .post(requestString, data)
    .then(response => {
      return {
        type: 'CREATE_MESSAGE_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_MESSAGE_FAIL',
        error
      }
    })
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
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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

export const updateFieldPartnerStatus = (id, status) => {
  let requestString = BACKEND_URL + '/field_partner/update/' + id
  let data = new FormData()
  data.append('app_status', status)
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

export const updateFPInstructions = (id, instructions) => {
  let requestString = BACKEND_URL + '/field_partner/update/' + id
  let data = new FormData()
  data.append('instructions', instructions)
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

export const deleteDocumentsByFP = id => {
  let requestString = BACKEND_URL + '/document/delete/fp/' + id
  return axios
    .delete(requestString)
    .then(response => {
      return {
        type: 'DELETE_DOCUMENTS_SUCCESS',
        response
      }
    })
    .catch(error => {
      return {
        type: 'DELETE_DOCUMENTS_FAIL',
        error
      }
    })
}

export const getAccessToken = () => {
  let requestString = BACKEND_URL + '/box/token'
  return axios
    .get(BACKEND_URL + '/box/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return response.data.result.output
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const updateDocumentStatus = (userID, id, status) => {
  var data = new FormData()
  data.append('status', status)

  createMessage(userID, false, true, id, status)

  return axios
    .put(BACKEND_URL + '/document/status/' + id, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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

export const uploadDocument = (userID, file, file_name, docID) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)

  createMessage(userID, false, false, docID, 'Pending')

  return axios
    .put(BACKEND_URL + '/document/upload/' + docID, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
    .post(BACKEND_URL + '/document_class/new', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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

export const createDocuments = (userID, docClassIDs, dueDate) => {
  let requestString = BACKEND_URL + '/document/create'
  let data = new FormData()
  data.append('userID', userID)
  data.append('status', 'Missing')
  data.append('docClassIDs', docClassIDs)
  data.append('dueDate', dueDate)
  return axios
    .post(requestString, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      // create the message here with the given docId
      let docIDs = response.data.result.docIDs
      docIDs.array.forEach(docID => {
        createMessage(userID, false, true, docID, 'Missing')
      })

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

export const getDocumentsByUser = userID => {
  let requestString = BACKEND_URL + '/document?uid=' + userID
  return axios
    .get(requestString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
    .then(response => {
      return response.data.result.documents
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return null
    })
}

export const updateDocumentClass = (id, name, description, file, file_name) => {
  var data = new FormData()
  data.append('file', file)
  data.append('fileName', file_name)
  data.append('name', name)
  data.append('description', description)
  return axios
    .put(BACKEND_URL + '/document_class/update/' + id, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
    .delete(BACKEND_URL + '/document_class/delete/' + id, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: getCookieFromBrowser('token')
      }
    })
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
