from flask import Blueprint, request, json
from api.models import Person, Document, Message, FieldPartner, PortfolioManager, db
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
    sample_args = request.args
    new_data = Document(**data)
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


# function that is called when you visit /field_partner, gets all the FPs
@main.route("/field_partner", methods=["GET"])
def get_field_partner():
    field_partner = FieldPartner.query.all()
    return create_response(data={"field_partner": serialize_list(field_partner)})


# function that is called when you visit /field_partner/get/id/<id> that gets a field partner by id
@main.route("/field_partner/id/<id>", methods=["GET"])
def get_fp_by_id(id):
    field_partner_by_id = FieldPartner.query.get(id)
    return create_response(data={"field_partner": field_partner_by_id.to_dict()})


# function that is called when you visit /field_partner/get/email/<email>, gets an FP by email
@main.route("/field_partner/email/<email>", methods=["GET"])
def get_fp_by_email(email):
    field_partner_by_email = FieldPartner.query.filter(FieldPartner.email == email)
    return create_response(
        data={"field_partner": serialize_list(field_partner_by_email)}
    )


# function that is called when you visit _____, gets an FP's org name by ID
@main.route("/field_partner/org_name/<id>", methods=["GET"])
def get_org_by_id(id):
    fp_by_id = FieldPartner.query.get(id)
    return create_response(data={"org_name": fp_by_id.org_name})


# function that is called when you visit /field_partner/get/pm/<pm_id>, filters FPs by PM IDs
@main.route("/field_partner/pm/<pm_id>", methods=["GET"])
def get_fp_by_pm(pm_id):
    field_partner_list = FieldPartner.query.filter(FieldPartner.pm_id == pm_id).all()
    return create_response(data={"field_partner": serialize_list(field_partner_list)})


# function that is called when you visit /field_partner/new, creates a new FP
@main.route("/field_partner/new", methods=["POST"])
def new_fp():
    data = request.get_json()
    logger.info(data)
    if "email" not in data:
        return create_response(status=422, message="No email provided for new FP")
    if "org_name" not in data:
        return create_response(
            status=422, message="No organization name provided for new FP"
        )
    if "pm_id" not in data:
        return create_response(status=422, message="No PM ID provided for new FP")
    if "app_status" not in data:
        return create_response(
            status=422, message="No application status provided for new FP"
        )
    sample_args = request.args
    new_fp = FieldPartner(**data)
    return create_response(data={"field_partner": new_fp.to_dict()})


# function that is called when you visit /field_partner/update/<id>, updates an FP's app status info
@main.route("/field_partner/update/<id>", methods=["PUT"])
def update_app_status(id):
    fp = FieldPartner.query.get(id)
    fp.app_status = request.get_json().get("app_status", "")
    ret = fp.to_dict()

    db.session.commit()
    return create_response(data={"field_partner": ret})


# ------------------------- PM endpoints. Will implement tests after MVP -------------------------------------

# function that is called when you visit /portfolio_manager
@main.route("/portfolio_manager", methods=["GET"])
def get_portfolio_manager():
    portfolio_manager = PortFolioManager.query.all()
    return create_response(
        data={"portfolio_manager": serialize_list(portfolio_manager)}
    )


# function that is called when you visit /portfolio_manager/get/id/<id> that gets a portfolio manager by id
@main.route("/portfolio_manager/id/<id>", methods=["GET"])
def get_pm_by_id(id):
    portfolio_manager_by_id = PortfolioManager.query.get(id)
    return create_response(
        data={"portfolio_manager": portfolio_manager_by_id.to_dict()}
    )


# function that is called when you visit /portfolio_manager/<email>, gets a PM by email
@main.route("/portfolio_manager/email/<email>", methods=["GET"])
def get_pm_by_email(email):
    portfolio_manager_by_email = PortfolioManager.query.filter(
        PortfolioManager.email == email
    )
    return create_response(
        data={"portfolio_manager": serialize_list(portfolio_manager_by_email)}
    )


# function that is called when you visit /portfolio_manager/all_fps/<id> that gets a portfolio manager by id
@main.route("/portfolio_manager/all_fps/<id>", methods=["GET"])
def get_all_fps_by_id(id):
    pm_by_id = PortfolioManager.query.get(id)
    return create_response(data={"list_of_fps": pm_by_id.list_of_fps})


# function that is called when you visit /portfolio_manager/new, creates a new PM
@main.route("/portfolio_manager/new", methods=["POST"])
def new_pm():
    data = request.get_json()
    logger.info(data)
    if "email" not in data:
        return create_response(status=422, message="No email provided for new PM")
    if "name" not in data:
        return create_response(status=422, message="No name provided for new PM")
    if "list_of_fps" not in data:
        return create_response(status=422, message="No list of FPs provided for new PM")
    sample_args = request.args
    new_pm = PortfolioManager(**data)
    return create_response(data={"portfolio_manager": new_pm.to_dict()})


# function that is called when you visit /portfolio_manager/add/<pm_id>/<fp_id>, adds an existing FP to the PM's list of FPs
@main.route("/portfolio_manager/<pm_id>/<fp_id>", methods=["PUT"])
def add_fp(pm_id, fp_id):
    pm = PortfolioManager.query.get(pm_id)
    pm.list_of_fps = pm.list_of_fps + [fp_id]
    db.session.commit()
    return create_response(data={"list_of_fps": pm.list_of_fps})


# function that is called when you visit /portfolio_manager/delete/<pm_id>/<fp_id>, removes an existing FP from the PM's list of FPs
@main.route("/portfolio_manager/<pm_id>/<fp_id>", methods=["DELETE"])
def delete_fp(pm_id, fp_id):
    pm = PortfolioManager.query.get(pm_id)

    if fp_id in pm.list_of_fps:
        pm.list_of_fps.remove(fp_id)
        print(pm)
        db.session.commit()
        return create_response(data={"list_of_fps": pm.list_of_fps})
    return create_response(
        status=422,
        message="The FP is not in the given PM's list. Please check to make sure your IDs are correct and try again.",
    )
