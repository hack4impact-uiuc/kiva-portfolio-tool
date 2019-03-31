from flask import Blueprint, request, json
from api.models import Document, Message, db
from api.core import create_response, serialize_list, logger
import box

main = Blueprint("main", __name__)  # initialize blueprint


# function that is called when you visit /
@main.route("/")
def index():
    # you are now in the current application context with the main.route decorator
    # access the logger with the logger from api.core and uses the standard logging module
    # try using ipdb here :) you can inject yourself
    logger.info("Hello World!")
    return "<h1>Hello World!</h1>"


"""
Template for different endpoints -> both GET and POST
To write these, make sure to create a new .py. Add a new blueprint to the file and the __init__.py

# Getting all the information in the specified data table
# To specify specific data you want to call from the class you specified, call methods accordingly and input parameter: data = {}, status = 200, message="ex: success"
@main.route("/<yourclassname>", methods=["GET"])
def get_<yourclassname>():
    sample_var = <yourclassname>.query.all()
    return create_response(data={"<yourclassname>": serialize_list(messages)})

@main.route("/<yourclassname>", methods=["POST"])
def add_<yourclassname>():
    sample_args = request.args
    new_data = dataclassname(sample_args ...)
    return create_response(status=200, message="success")
"""

# function that is called when you visit /documetns
@main.route("/document", methods=["GET"])
def get_document():
    kwargs = {}
    kwargs["fileID"] = request.args.get("fid")
    kwargs["userID"] = request.args.get("uid")
    kwargs["status"] = request.args.get("status")
    kwargs["docClass"] = request.args.get("docClass")
    kwargs["fileName"] = request.args.get("fileName")
    kwargs["latest"] = request.args.get("latest")
    date = request.args.get("date")
    description = request.args.get("description")
    kwargs = {k: v for k, v in kwargs.items() if v is not None}
    if len(kwargs) == 0:
        docs = Document.query.all()
        if description is not None:
            docs = [
                i
                for i in docs
                if i.description is not None
                and description.lower() in i.description.lower()
            ]
        if date is not None:
            docs = [i for i in docs if date.lower() in str(i.date).lower()]
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="Query was incorrect")

        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Approved"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]
        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Approved": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )
    else:
        docs = Document.query.filter_by(**kwargs)
        if description is not None:
            docs = [
                i
                for i in docs
                if i.description is not None
                and description.lower() in i.description.lower()
            ]
        if date is not None:
            docs = [i for i in docs if date.lower() in str(i.date).lower()]
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="Query was incorrect")

        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Approved"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]
        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Approved": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )


# function that is called when you visit /documetns
@main.route("/document/new", methods=["POST"])
def create_new_document():
    data = request.get_json()
    logger.info(data)
    if "userID" not in data:
        return create_response(
            status=422, message="No UserID provided for new Document"
        )
    if "status" not in data:
        return create_response(
            status=422, message="No Status provided for new Document"
        )
    if "docClass" not in data:
        return create_response(
            status=422, message="No Document Class provided for new Document"
        )
    # requeest.args[0] == file byte
    # request.args[1] == other args necessary for doc creation
    sample_args = request.args[1]
    new_data = Document(**data)

    file_info = upload_file(request.args[0], new_data.fileName)

    new_data.fileID = file_info["id"]
    # use retrieved file_info

    db.session.add(new_data)
    db.session.commit()
    return create_response(status=200, message="success")


# function that is called when you visit /documetns
@main.route("/document/delete/<docClass>", methods=["DELETE"])
def delete_document(docClass):
    logger.info(docClass)
    db.session.delete(
        Document.query.filter((Document.docClass == str(docClass))).first()
    )
    db.session.commit()
    return create_response(status=200, message="success")


# function that is called when you visit /documetns
@main.route("/document/update/<docClass>", methods=["PUT"])
def update_documents(docClass):
    doc = Document.query.filter((Document.docClass == docClass)).first()
    logger.info(doc.docClass)
    doc.fileID = request.json.get("fileID", doc.fileID)
    doc.date = request.json.get("date", doc.date)
    doc.status = request.json.get("status", doc.status)
    doc.docClass = request.json.get("docClass", doc.docClass)
    doc.fileName = request.json.get("fileName", doc.fileName)
    doc.latest = request.json.get("latest", doc.latest)
    doc.description = request.json.get("description", doc.description)
    db.session.commit()
    return create_response(status=200, message="success")


@main.route("/document/update/<id>/<status>", methods=["PUT"])
def update_status(id, status):
    """ function called when you visit /document/update/<id>/<status>. Updates a doc's status """
    doc = Document.query.get(id)
    doc.status = status
    ret = doc.to_dict()

    db.session.commit()
    return create_response(data={"document": ret})
