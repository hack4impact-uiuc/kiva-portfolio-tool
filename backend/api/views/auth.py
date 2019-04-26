from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json, random, string

auth = Blueprint("auth", __name__)

BACKEND_URL = "http://localhost:8000/"


@auth.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "password" not in data:
        return create_response(status=400, message="Missing password!")

    if "securityQuestionAnswer" not in data:
        return create_response(status=400, message="Missing security question answer!")

    if "answer" not in data:
        return create_response(status=400, message="Missing answer!")

    if "questionIdx" not in data:
        return create_response(status=400, message="Missing question index!")

    if "role" not in data:
        return create_response(status=400, message="Missing role!")

    email = data.get("email")
    password = data.get("password")
    securityQuestionAnswer = data.get("securityQuestionAnswer")
    answer = data.get("answer")
    question_index = data.get("questionIdx")
    role = data.get("role")
    r = (
        requests.post(
            BACKEND_URL + "register",
            data={
                "email": email,
                "password": password,
                "securityQuestionAnswer": securityQuestionAnswer,
                "answer": answer,
                "questionIdx": question_index,
                "role": role,
            },
        )
    ).json()
    if r.get("status") == 400:
        return create_response(status=400, message=r.get("message"))

    return create_response(
        status=200,
        message="success",
        data={"token": r.get("token"), "uid": r.get("uid")},
    )


@auth.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "password" not in data:
        return create_response(status=400, message="Missing password!")

    email = data.get("email")
    password = data.get("password")
    r = (
        requests.post(
            BACKEND_URL + "login", data={"email": email, "password": password}
        )
    ).json()
    if r.get("status") == 400:
        return create_response(status=400, message=r.get("message"))

    return create_response(
        status=200,
        message="success",
        data={"token": r.get("token"), "uid": r.get("uid")},
    )


@auth.route("/verifyEmail", methods=["POST"])
def verify_email():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "password" not in data:
        return create_response(status=400, message="Missing password!")

    if "pin" not in data:
        return create_response(status=400, message="Missing pin!")

    email = data.get("email")
    pin = data.get("pin")

    r = (
        requests.post(BACKEND_URL + "verifyEmail", data={"email": email, "pin": pin})
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r.get("message"))


@auth.route("/resendVerificationEmail", methods=["POST"])
def resendPIN():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    token = request.headers.get("token")
    headers = {"Content-type": "application/json", "token": token}

    r = (requests.get(BACKEND_URL + "resendVerificationEmail", headers=headers)).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r["message"])


@auth.route("/createFP", methods=["POST"])
def create_fp():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "password" not in data:
        return create_response(status=400, message="Missing password!")

    if "role" not in data:
        return create_response(status=400, message="Missing role!")

    email = data.get("email")
    password = randomStringDigits()
    role = "fp"

    r = (
        requests.post(
            BACKEND_URL + "register",
            data={"email": email, "password": password, "role": role},
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(
        status=200,
        message="success",
        data={"token": r.get("token"), "uid": r.get("uid"), "password": password},
    )


def randomStringDigits():
    string_length = 10

    lettersAndDigits = string.ascii_letters + string.digits
    return "".join(random.choice(lettersAndDigits) for i in range(string_length))


@auth.route("/changePassword", methods=["POST"])
def change_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    if "currentPassword" not in data:
        return create_response(status=400, message="Missing current password!")

    if "newPassword" not in data:
        return create_response(status=400, message="Missing new password!")

    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    token = request.headers.get("token")
    headers = {"Content-type": "application/json", "token": token}

    r = (
        requests.get(
            BACKEND_URL + "changePassword",
            data={"currentPassword": current_password, "newPassword": new_password},
            headers=headers,
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r["message"])

    return create_response(
        status=200, message="success", data={"token": r.get("token")}
    )


@auth.route("/forgotPassword", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "answer" not in data:
        return create_response(status=400, message="Missing answer!")

    if "questionIdx" not in data:
        return create_response(status=400, message="Missing question index!")

    email = data.get("email")
    answer = data.get("answer")
    question_index = data.get("questionIdx")

    r = (
        requests.post(
            BACKEND_URL + "forgotPassword",
            data={"email": email, "answer": answer, "questionIdx": question_index},
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r["message"])


@auth.route("/resetPassword", methods=["POST"])
def reset_password():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    email = data.get("email")
    password = data.get("password")
    pin = data.get("pin")
    answer = data.get("answer")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    if "password" not in data:
        return create_response(status=400, message="Missing password!")

    if "answer" not in data:
        return create_response(status=400, message="Missing answer!")

    if "pin" not in data:
        return create_response(status=400, message="Missing pin!")

    r = (
        requests.post(
            BACKEND_URL + "resetPassword",
            data={"email": email, "password": password, "pin": pin, "answer": answer},
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(
        status=200, message="success", data={"token": r.get("token")}
    )


@auth.route("/addSecurityQuestionAnswer", methods=["POST"])
def add_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "answer" not in data:
        return create_response(status=400, message="Missing answer!")

    if "questionIdx" not in data:
        return create_response(status=400, message="Missing question index!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    questionIdx = data.get("questionIdx")
    answer = data.get("answer")

    token = request.headers.get("token")
    headers = {"Content-type": "application/json", "token": token}

    r = (
        requests.get(
            BACKEND_URL + "addSecurityQuestionAnswer",
            data={"questionIdx": questionIdx, "answer": answer},
            headers=headers,
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r["message"])


@auth.route("/getSecurityQuestions", methods=["GET"])
def get_security_questions():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    token = request.headers.get("token")

    headers = {"Content-type": "application/json", "token": token}
    r = (requests.get(BACKEND_URL + "getSecurityQuestions", headers=headers)).json()

    return create_response(
        status=200, message="success", data={"questions": r.get("questions")}
    )


@auth.route("/getSecurityQuestionForUser", methods=["POST"])
def get_security_question():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "email" not in data:
        return create_response(status=400, message="Missing email!")

    email = data.get("email")

    r = (
        requests.post(BACKEND_URL + "getSecurityQuestionForUser", data={"email": email})
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(
        status=200, message="success", data={"question": r.get("question")}
    )


@auth.route("/resendVerification", methods=["POST"])
def resend_verification():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    token = request.headers.get("token")
    headers = {"Content-type": "application/json", "token": token}

    r = (requests.get(BACKEND_URL + "resendVerificationEmail", headers=headers)).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r.get("message"))
