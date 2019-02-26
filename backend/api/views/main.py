from flask import Blueprint
from api.models import Person, Document, Message, FieldPartner, PortfolioManager
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
    return create_response(data={"documents": serialize_list(docs)})

# function that is called when you visit /fieldpartners
@main.route("/field_partner", methods=["GET"])
def get_field_partner():
    field_partner = FieldPartner.query.all()
    return create_response(data={"field partners": serialize_list(field_partner)})

# function that is called when you visit /portfoliomanager
@main.route("/portfolio_manager", methods=["GET"])
def get_portfolio_manager():
    portfolio_manager = PortfolioManager.query.all()
    return create_response(data={"portfolio manager": serialize_list(portfolio_manager)})