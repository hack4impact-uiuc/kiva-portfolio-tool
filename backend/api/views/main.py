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


# function that is called when you visit /persons
@main.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.all()
    return create_response(data={"messages": serialize_list(messages)})


# function that is called when you visit /documetns
@main.route("/documents", methods=["GET"])
def get_document():
    docs = Document.query.all()
    pending = [i for i in docs if i.status == "Pending"]
    verified = [i for i in docs if i.status == "Verified"]
    missing = [i for i in docs if i.status == "Missing"]
    rejected = [i for i in docs if i.status == "Rejected"]
    logger.info(pending)
    # return create_response(data={"documents": serialize_list(docs)})
    return create_response(
        data={
            "documents": {
                "Pending": serialize_list(pending),
                "Verified": serialize_list(verified),
                "Missing": serialize_list(missing),
                "Rejected": serialize_list(rejected),
            }
        }
    )
