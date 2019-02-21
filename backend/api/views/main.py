from flask import Blueprint
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

# function that is called when you visit /persons
@main.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.all()
    return create_response(data={"messages": serialize_list(messages)})


# function that is called when you visit /documetns
@main.route("/documents", methods=["GET"])
def get_document():
    docs = Document.query.all()
    return create_response(data={"documents": serialize_list(docs)})
