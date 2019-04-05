from flask import Blueprint, request, json, jsonify
from api.models import DocumentClass, db
from api.core import create_response, serialize_list, logger

import requests, json

docclass = Blueprint("docclass", __name__)


@docclass.route("/document_class", methods=["GET"])
def get_document_class():
    """ function that is called when you visit /document_class, gets all the docclasses """
    document_class = DocumentClass.query.all()
    return create_response(data={"document_class": serialize_list(document_class)})


@docclass.route("/document_class/<id>", methods=["GET"])
def get_document_class_by_id(id):
    """ function that is called when you visit /document_class/<id>, gets a docclass by id """
    document_class = DocumentClass.query.get(id)
    return create_response(data={"document_class": document_class.to_dict()})


@docclass.route("/document_class/new", methods=["POST"])
def add_document_class():
    """ function that is called when you visit /document_class/new, creates a new docclass """
    data = request.get_json()
    logger.info(data)
    if "name" not in data:
        return create_response(
            status=422, message="No name provided for new Document Class"
        )

    sample_args = request.args
    new_docclass = DocumentClass(**data)
    db.session.add(new_docclass)
    db.session.commit()
    ret = new_docclass.to_dict()
    return create_response(status=200, message="success")


@docclass.route("/document_class/update/<id>", methods=["PUT"])
def update_document_class(id):
    """ function that is called when you visit /document_class/update/<id>, updates a docclass """
    docclass = DocumentClass.query.get(id)
    docclass.name = request.json.get("name", docclass.name)
    docclass.description = request.json.get("description", docclass.description)
    updated_docclass = docclass.to_dict()

    db.session.commit()
    return create_response(data={"document_class": updated_docclass})
