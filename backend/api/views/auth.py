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

    token = r.get("token")
    print(email)
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}
    
    local_r = (
        requests.post(
            "http://localhost:5000/portfolio_manager/new",
            data={
                "email": email,
                "name": "Daniel",
            },
            headers=headers
        )
    ).json()

    print(local_r)

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


@auth.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")
    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}
    
    r = (requests.post(BACKEND_URL + "verify", headers=headers)).json()
    
    if r.get("status") == 400 or r.get("status") == 500:
        print(r)
        return create_response(status=r.get("status"), message=r.get("message"))
    print("passed")
    return create_response(status=200, message=r.get("message"), data={"role": r.get("role")})


@auth.route("/getUser", methods=["GET"])
def get_user_role():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}
    r = (requests.post(BACKEND_URL + "getUser", headers=headers)).json()
    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, data={"userRole": r.get("user_role")})


@auth.route("/verifyEmail", methods=["POST"])
def verify_email():
    data = request.get_json()
    if data is None:
        data = request.form

    if data is None:
        return create_response(status=400, message="Missing Data!")

    if "pin" not in data:
        return create_response(status=400, message="Missing pin!")

    pin = data.get("pin")

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}
    r = (
        requests.post(BACKEND_URL + "verifyEmail", data={"pin": pin}, headers=headers)
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
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

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

    if "org_name" not in data:
        return create_response(status=400, message="Missing Org name!")

    if "app_status" not in data:
        return create_response(status=400, message="Missing app status!")

    if "pm_id" not in data:
        return create_response(status=400, message="Missing pm id!")

    if "token" not in request.headers:
        return create_response(status=400, message="Missing token!")

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, role = verify_token(token)

    if role == "fp":
        return create_response(status=400, message="You do not have permission!")

    email = data.get("email")
    password = randomStringDigits()
    role = "fp"
    pm_id = data.get("pm_id")
    app_status = data.get("app_status")
    org_name = data.get("org_name")

    r = (
        requests.post(
            BACKEND_URL + "register",
            data={"email": email, "password": password, "role": role},
        )
    ).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    local_r = (
        requests.post(
            "http://localhost:5000/field_partner/new",
            data={
                "email": email,
                "pm_id": pm_id,
                "org_name": org_name,
                "app_status": app_status,
            },
        )
    ).json()

    if local_r.get("status") == 400 or local_r.get("status") == 500:
        return create_response(
            status=local_r.get("status"), message=local_r.get("message")
        )

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
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

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

    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}
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
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    r = (requests.get(BACKEND_URL + "resendVerificationEmail", headers=headers)).json()

    if r.get("status") == 400 or r.get("status") == 500:
        return create_response(status=r.get("status"), message=r.get("message"))

    return create_response(status=200, message=r.get("message"))


def verify_token(token):
    """ helper function that verifies the token sent from client and returns an appropriate response and the permission/role (if it exists)"""

    if token is None:
        return "Token is required.", None
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    r = (
        requests.get(BACKEND_URL + "getUser", headers=headers)
    ).json()

    if r.get("status") == 400:
        return r.get("message"), None

    return None, r.get("role")
