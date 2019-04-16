from flask import Blueprint, request, json
from api.models import DocumentClass, db
from api.views.box import upload_file
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
    return create_response(
        status=200, data={"document_class": document_class.to_dict()}
    )


@docclass.route("/document_class/new", methods=["POST"])
def add_document_class():
    """ function that is called when you visit /document_class/new, creates a new docclass """
    # data = request.get_json()
    # if data is None:
    #    data = request.form

    data = request.form

    if data is None:
        return create_response(status=400, message="No data provided")

    if "name" not in data:
        return create_response(
            status=400, message="No name provided for new Document Class"
        )

    new_docclass = DocumentClass(data)

    if "fileName" in data and request.files is not None and "file" in request.files:
        fileName = data.get("fileName")
        file = request.files.get("file")
        file_info = upload_file(file, fileName)
        new_docclass.example = file_info["link"]

    db.session.add(new_docclass)
    db.session.commit()
    return create_response(status=200, message="success")


@docclass.route("/document_class/update/<id>", methods=["PUT"])
def update_document_class(id):
    """ function that is called when you visit /document_class/update/<id>, updates a docclass """
    docclass = DocumentClass.query.get(id)
    docclass.name = request.json.get("name", docclass.name)
    docclass.description = request.json.get("description", docclass.description)
    updated_docclass = docclass.to_dict()

    db.session.commit()
    return create_response(status=200, data={"document_class": updated_docclass})
