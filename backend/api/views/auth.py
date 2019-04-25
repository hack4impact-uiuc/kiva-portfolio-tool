from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json, random, string

auth = Blueprint("auth", __name__)

backend_url = "http://localhost:8000/"

@auth.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    password = data["password"]
    role = data["role"]
    question_index = data["questionIdx"]
    r = (requests.post(backend_url + "register", data={'email': email, 'password': password, 'role': role, 'questionIdx': question_index})).json()
    if r['status'] == 400:
        return create_response(status=400, message=r['message'])

    return create_response(status=200, message="success", data={'token':r['token'], 'uid': r['uid']})

@auth.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    password = data["password"]
    r = (requests.post(backend_url + "login", data={'email': email, 'password': password})).json()
    if r['status'] == 400:
        return create_response(status=400, message=r['message'])

    return create_response(status=200, message="success", data={'token':r['token'], 'uid': r['uid']})

@auth.route("/verifyEmail", methods=["POST"])
def verify_email():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    pin = data["pin"]

    r = (requests.post(backend_url + "verifyEmail", data={'email': email, 'pin': pin})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message=r['message'])

@auth.route("/createFP", methods=["POST"])
def create_fp():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    password = randomStringDigits()
    role = "fp"

    r = (requests.post(backend_url + "register", data={'email': email, 'password': password, 'role': role})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message="success", data={'token':r.text.token, 'uid': r.text.uid, 'password': password})

def randomStringDigits():
    string_length = 10

    lettersAndDigits = string.ascii_letters + string.digits
    return ''.join(random.choice(lettersAndDigits) for i in range(string_length))


@auth.route("/changePassword", methods=["POST"])
def change_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    token = data["token"]
    current_password = data["currentPassword"]
    new_password = data["newPassword"]

    r = (requests.post(backend_url + "changePassword", data={'token': token, 'currentPassword': curr})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message="success", data={'token': r['token']})

@auth.route("/forgotPassword", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    answer = data["answer"]
    question_index = data["questionIdx"]

    r = (requests.post(backend_url + "forgotPassword", data={'email': email, 'answer': answer, 'questionIdx': question_index})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message=r['message'])

@auth.route("/resetPassword", methods=["POST"])
def reset_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]
    password = data["password"]
    pin = data["pin"]
    answer = data["answer"]

    r = (requests.post(backend_url + "resetPassword", data={'email': email, 'password': password, 'pin': pin, 'answer': answer})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message="success", data={'token': r['token']})

@auth.route("/addSecurityQuestionAnswer", methods=["POST"])
def add_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    token = data["token"]
    questionIdx = data["questionIdx"]
    answer = data["answer"]

    r = (requests.post(backend_url + "addSecurityQuestionAnswer", data={'token': token, 'questionIdx': questionIdx, 'answer': answer})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message=r['message'])

@auth.route("/getSecurityQuestions", methods=["GET"])
def get_security_questions():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")
    print(data)
    token = request.headers.get('token')
    print(token)
    headers = {'Content-type': 'application/json', 'token': token}    
    r = (requests.get(backend_url + "getSecurityQuestions", headers = headers)).json()
    print(r)

    return create_response(status=200, message="success", data={'questions': r['questions']})


@auth.route("/getSecurityQuestionForUser", methods=["POST"])
def get_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data["email"]

    r = (requests.post(backend_url + "getSecurityQuestionForUser", data={'email': email})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message="success", data={'question': r['question']})

@auth.route("/resendVerification", methods=["POST"])
def resend_verification():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    token = data["token"]

    r = (requests.post(backend_url + "resendVerificationEmail", headers={'token': token})).json()

    if r['status'] == 400 or r['status'] == 500:
        return create_response(status=r['status'], message=r['message'])

    return create_response(status=200, message=r['message'])  
