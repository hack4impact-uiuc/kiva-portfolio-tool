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

    email = data["email"]
    password = data["password"]
    role = data["role"]
    
    r = requests.post(backend_url + "register", data={'email': email, 'password': password, 'role': role})

    return create_response(status=200, message="success", data={'token':r.text.token, 'uid': r.text.uid})

@auth.route("/verifyEmail", methods=["POST"])
def verify_email():
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]
    pin = data["pin"]

    r = requests.post(backend_url + "verifyEmail", data={'email': email, 'pin': pin})

    return create_response(status=200, message="success")

@auth.route("/createFP", methods=["POST"])
def create_fp():
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]
    password = randomStringDigits()
    role = "fp"

    r = requests.post(backend_url + "register", data={'email': email, 'password': password, 'role': role})

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

    token = data["token"]
    current_password = data["currentPassword"]
    new_password = data["newPassword"]

    r = requests.post(backend_url + "changePassword", data={'token': token, 'currentPassword': curr})

    return create_response(status=200, message="success", data={'token': r.text.token})

@auth.route("/forgotPassword", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]
    answer = data["answer"]

    r = requests.post(backend_url + "forgotPassword", data={'email': email, 'answer': answer})

    return create_response(status=200, message=r.text.message)

@auth.route("/resetPassword", methods=["POST"])
def reset_password():
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]
    password = data["password"]
    pin = data["pin"]
    answer = data["answer"]

    r = requests.post(backend_url + "resetPassword", data={'email': email, 'password': password, 'pin': pin, 'answer': answer})

    return create_response(status=200, message="success", data={'token': r.text.token})

@auth.route("/addSecurityQuestion", methods=["POST"])
def add_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    token = data["token"]
    question = data["question"]
    answer = data["answer"]

    r = requests.post(backend_url + "addSecurityQuestion", data={'token': token, 'question': question, 'answer': answer})

    return create_response(status=200, message=r.text.message)

@auth.route("/getSecurityQuestion", methods=["POST"])
def get_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]

    r = requests.post(backend_url + "getSecurityQuestion", data={'email': email})

    return create_response(status=200, message="success", data={'question': r.text.question})

@auth.route("/resendVerification", methods=["POST"])
def resend_verification():
    data = request.get_json()
    if data is None:
        data = request.form

    token = data["token"]

    r = requests.post(backend_url + "resendVerificationEmail", headers={'token': token})

    return create_response(status=200, message=r.text.message)  
