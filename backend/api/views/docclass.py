from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json

docclass = Blueprint("docclass", __name__)


@docclass.route("/document_class", methods=["GET"])
def get_document_class():
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    if role == "fp":
        return create_response(status=400, message="You do not have permission to authorize this request.")

    """ function that is called when you visit /document_class, gets all the docclasses """
    document_class = DocumentClass.query.all()
    return create_response(status=200, data={"document_class": serialize_list(document_class), "role": role})


@docclass.route("/document_class/<id>", methods=["GET"])
def get_document_class_by_id(id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    if role == "fp":
        return create_response(status=400, message="You do not have permission to authorize this request.")

    """ function that is called when you visit /document_class/<id>, gets a docclass by id """
    document_class = DocumentClass.query.get(id)
    return create_response(
        status=200, data={"document_class": document_class.to_dict(), "role": role}
    )


@docclass.route("/document_class/new", methods=["POST"])
def add_document_class():
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    if role == "fp":
        return create_response(status=400, message="You do not have permission to authorize this request.")    
    """ function that is called when you visit /document_class/new, creates a new docclass """
    logger.info(data)
    if "name" not in data:
        return create_response(
            status=400, message="No name provided for new Document Class"
        )

    sample_args = request.args
    new_docclass = DocumentClass(**data)
    db.session.add(new_docclass)
    db.session.commit()
    ret = new_docclass.to_dict()
    return create_response(status=200, message="success", data={"role": role})


@docclass.route("/document_class/update/<id>", methods=["PUT"])
def update_document_class(id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    if role == "fp":
        return create_response(status=400, message="You do not have permission to authorize this request.")
    """ function that is called when you visit /document_class/update/<id>, updates a docclass """
    docclass = DocumentClass.query.get(id)
    docclass.name = request.json.get("name", docclass.name)
    docclass.description = request.json.get("description", docclass.description)
    updated_docclass = docclass.to_dict()

    db.session.commit()
    return create_response(status=200, data={"document_class": updated_docclass, "role" : role})


def verify_token(token):
    """ helper function that verifies the token sent from client and returns an appropriate response and the permission/role (if it exists)"""
    
    if token is None:
        return create_response(status=400, message="Token is required."), None 
    
    r = requests.post("http://localhost:8000/verify", headers={'token': headers['token']})
    res = r.json()

    if res["status"] == 400:
        return create_response(status=400, message=res["message"]), None

    return None, res["permission"]
