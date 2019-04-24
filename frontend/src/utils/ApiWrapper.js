import axios from 'axios'
import BACKEND_URL from './ApiConfig'
import MockData from './MockData'

//import { BACKEND_KEY } from '../keys'

export const register = (email, password, role) => {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  console.log(data)
  data.append('role', role)
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
  console.log("test")
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
  let data = new FormData()
  data.append('email', emailInput)
  data.append('password', passwordInput)
  console.log(data)
  data.append('role', role)
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

function verify() {
  try {
    return fetch(`http://localhost:5000/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token: getCookie("token") }
    });
  } catch (err) {
    console.log(err);
  }
}

function setSecurityQuestion(question, answer, password) {
  try {
    return fetch(`http://localhost:5000/addSecurityQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token")
      },
      body: JSON.stringify({
        question,
        answer,
        password
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function getSecurityQuestion(email) {
  try {
    return fetch(`http://localhost:5000/getSecurityQuestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function submitSecurityQuestionAnswer(email, answer) {
  try {
    return fetch(`http://localhost:5000/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        answer
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function resetPassword(pin, email, password, answer) {
  try {
    return fetch(`http://localhost:5000/passwordReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin,
        email,
        password,
        answer
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function changePassword(currentPassword, newPassword) {
  try {
    return fetch(`http://localhost:5000/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token")
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function getUsersForRolesPage() {
  console.log("ROLES");
  try {
    return fetch(`http://localhost:5000/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token"),
        google: getCookie("google")
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function changeRole(userEmail, newRole, password) {
  try {
    return fetch(`http://localhost:5000/roleschange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token"),
        google: getCookie("google")
      },
      body: JSON.stringify({
        userEmail,
        newRole,
        password
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function google(tokenId) {
  try {
    return fetch(`http://localhost:5000/google`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tokenId: tokenId
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function verifyPIN(pin) {
  try {
    return fetch(`http://localhost:5000/verifyEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token")
      },
      body: JSON.stringify({
        pin
      })
    });
  } catch (err) {
    console.log(err);
  }
}

function resendPIN() {
  try {
    return fetch(`http://localhost:5000/resendVerificationEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token")
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function userInfo() {
  try {
    return fetch(`http://localhost:5000/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: getCookie("token"),
        google: getCookie("google")
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export {
  register,
  login,
  verify,
  setSecurityQuestion,
  getSecurityQuestion,
  submitSecurityQuestionAnswer,
  resetPassword,
  changePassword,
  getUsersForRolesPage,
  changeRole,
  verifyPIN,
  resendPIN,
  google,
  userInfo
};

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
