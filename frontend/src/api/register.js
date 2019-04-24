import axios from 'axios'

const { sendResponse } = require('./../utils/sendResponse')
const BACKEND_URL = 'http://localhost:8000/'

export const register = (email, password, role) => {
  let data = new FormData()
  data.append('email', email)
  data.append('password', password)
  data.append('role', role)
  data.append('crossdomain', true)
  return axios
    .post(BACKEND_URL + 'register/', data)
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

/*
router.post("/register", async function(req, res) {
  const body = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  const results = await fetch("http://localhost:8000/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const resp = await results.json();
  if (!resp.token) {
    sendResponse(res, 400, resp.message);
  } else {
    sendResponse(res, 200, resp.message, {
      token: resp.token,
      userID: resp.uid,
      permission: resp.permission
    });
  }
});

module.exports = router;
*/
