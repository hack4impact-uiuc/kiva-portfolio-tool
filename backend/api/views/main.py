from flask import Blueprint, request
from api.models import Person, Document, Message
from api.core import create_response, serialize_list, logger

main = Blueprint("main", __name__)  # initialize blueprint


# function that is called when you visit /
@main.route("/")
def index():
    # you are now in the current application context with the main.route decorator
    # access the logger with the logger from api.core and uses the standard logging module
    # try using ipdb here :) you can inject yourself
    logger.info("Hello World!")
    return "<h1>Hello World!</h1>"


# function that is called when you visit /persons
@main.route("/persons", methods=["GET"])
def get_persons():
    persons = Person.query.all()
    return create_response(data={"persons": serialize_list(persons)})


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
    kwargs["docType"] = request.args.get("docType")
    kwargs["docName"] = request.args.get("docName")
    kwargs["latest"] = request.args.get("latest")
    date = request.args.get("date")
    description = request.args.get("description")
    kwargs = {k: v for k, v in kwargs.items() if v is not None}
    if len(kwargs) == 0:
        docs = Document.query.all()
        if description is not None:
            docs = [i for i in docs if description in i.description]
        if date is not None:
            docs = [i for i in docs if date in str(i.date)]
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="Query was incorrect")

        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Verified"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]
        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Verified": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )
    else:
        docs = Document.query.filter_by(**kwargs)
        if description is not None:
            docs = [i for i in docs if description in i.description]
        if date is not None:
            docs = [i for i in docs if date in str(i.date)]
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="Query was incorrect")

        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Verified"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]
        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Verified": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )


# function that is called when you visit /documetns
@main.route("/document/new", methods=["POST"])
def create_new_document():
    data = request.get_json()
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    if 'name' not in data:
        return create_response(status=422, message="No name provided for new show")
    new_item = {
        "name": data['name'],
        "episodes_seen": data['episodes_seen']
    }
    return create_response(db.create('shows', new_item), message="New Item Added to DB", status=201)

