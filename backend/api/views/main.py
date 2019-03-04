from flask import Blueprint
from api.models import Person, Document, Message, FieldPartner, PortFolioManager
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

# function that is called when you visit /documents
@main.route("/documents", methods=["GET"])
def get_document():
    docs = Document.query.all()
    return create_response(data={"documents": serialize_list(docs)})


# function that is called when you visit /field_partner
@main.route("/field_partner", methods=["GET"])
def get_field_partner():
    field_partner = FieldPartner.query.all()
    return create_response(data={"field_partner": serialize_list(field_partner)})


# function that is called when you visit /field_partner/<id> that gets a field partner by id
@main.route("/field_partner/<id>", methods=["GET"])
def get_field_partner(id):
    field_partner_by_id = FieldPartner.query.get(id)
    return create_response(data={"field_partner": serialize_list(field_partner_by_id)})

### add FP endpoint: get org name by ID ---------------------------------------------------------

# function that is called when you visit /field_partner/<email>, gets an FP by email
@main.route("/field_partner/<email>", methods=["GET"])
def get_field_partner(email):
    field_partner_by_email = session.query(FieldPartner).filter_by(email = email)
    return create_response(data={"field_partner": serialize_list(field_partner_by_email)})

# function that is called when you visit /field_partner/<pm_id>, filters FPs by PM IDs
@main.route("/field_partner/<pm_id>", methods=["GET"])
def get_field_partner(pm_id):
    filed_partner_list = session.query(FieldPartner).filter_by(pm_id = pm_id)
    return create_response(data={"field_partner": serialize_list(filed_partner_list)})

# function that is called when you visit /portfolio_manager
@main.route("/portfolio_manager", methods=["GET"])
def get_portfolio_manager():
    portfolio_manager = PortFolioManager.query.all()
    return create_response(data={"portfolio_manager": serialize_list(portfolio_manager)})

# function that is called when you visit /portfolio_manager/<id> that gets a portfolio manager by id
@main.route("/portfolio_manager/<id>", methods=["GET"])
def get_portfolio_manager(id):
    portfolio_manager_by_id = PortFolioManager.query.get(id)
    return create_response(data={"portfolio_manager": serialize_list(portfolio_manager_by_id)})

# function that is called when you visit /portfolio_manager/<email>, gets a PM by email
@main.route("/portfolio_manager_by_id/<email>", methods=["GET"])
def get_portfolio_manager(email):
    portfolio_manager_by_email = session.query(PortFolioManager).filter_by(email = email)
    return create_response(data={"portfolio_manager": serialize_list(portfolio_manager_by_email)})

# function that is called when you visit /portfolio_manager/<fp_id>, adds an FP to the PM's list of FPs
@main.route("/portfolio_manager/<fp_id>", methods=["POST"])
def add_fp(fp_id):
    new_fp = 

# function that is called when you visit /portfolio_manager/<fp_id>, deletes an FP to the PM's list of FPs
@main.route("/portfolio_manager/<fp_id>", methods=["DELETE"])
def delete_fp(fp_id):
    
# function that is called when you visit /portfolio_manager/<fp_id>, adds an FP to the PM's list of FPs
@main.route("/portfolio_manager/<fp_id>", methods=["PUT"])
def update_fp(fp_id):