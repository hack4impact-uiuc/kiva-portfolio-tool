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
    
    print(data["email"], data["password"])

    return create_response(status=200, message="success")

#@auth.route("/login", methods=["GET"])