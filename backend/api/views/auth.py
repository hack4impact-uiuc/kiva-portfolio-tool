from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if data is None:
        data = request.form
    email = data["email"]
    password = data["password"]
    role = data["role"]

    r = requests.post("http://localhost:8000/register", data={'email': email, 'password': password, 'role': role})
    
    #print(data["email"], data["password"])

    return create_response(status=200, message="success")

@auth.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if data is None:
        data = request.form
    email = data["email"]
    password = data["password"]

    r = requests.post("http://localhost:8000/login", data={'email': email, 'password': password})
    res = r.json()

    return create_response(status=res["status"], 
                        message=res["message"], 
                        data={'userid': res['uid'],
                            'role': res['permission'],
                            'token': res['token']}
                            )

