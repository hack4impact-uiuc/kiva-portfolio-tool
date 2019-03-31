from flask import Blueprint, request
from api.models.Message import Message
from api.core import create_response, serialize_list, logger

docclass = Blueprint("docclass", __name__)


@docclass.route("/document_class", methods=["GET"])
def get_document_class():
    """ function that is called when you visit /document_class, gets all the docclasses """
    document_class = DocumentClass.query.all()
    return create_response(data={"document_class": serialize_list(document_class)})


@docclass.route("/document_class", methods=["POST"])
def add_document_class():
    """ function that is called when you visit /document_class, creates a new docclass """
    data = request.get_json()
    logger.info(data)
    if "name" not in data:
        return create_response(
            status=422, message="No name provided for new Document Class"
        )

    sample_args = request.args
    new_data = DocumentClass(**data)
    return create_response(status=200, message="success")
