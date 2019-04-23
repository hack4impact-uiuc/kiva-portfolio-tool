from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register_user():
    print("asdf")
    data = request.get_json()
    if data is None:
        data = request.form

    email = data["email"]
    password = data["password"]
    role = data["role"]
    
    r = requests.post("http://localhost:8000/register", data={'email': email, 'password': password, 'role': role})

    return create_response(status=200, message="success", data={'token':r.text.token, 'uid': r.text.uid})

#@auth.route("/login", methods=["GET"])