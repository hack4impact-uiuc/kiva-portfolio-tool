from flask import Blueprint, request, json
from api.models import FieldPartner, Document, db, PortfolioManager
from api.core import create_response, serialize_list, logger
from api.views.box import create_folder
import time

import requests, json

fp = Blueprint("fp", __name__)


@fp.route("/field_partners", methods=["GET"])
def get_field_partner():
    """ function that is called when you visit /field_partner, gets all the FPs """

    # gets database values from query string, if missing is None
    kwargs = {}
    kwargs["email"] = request.args.get("email")
    kwargs["org_name"] = request.args.get("org_name")
    kwargs["pm_id"] = request.args.get("pm_id")
    kwargs["due_date"] = request.args.get("due_date")
    kwargs["app_status"] = request.args.get("app_status")
    kwargs["instructions"] = request.args.get("instructions")

    kwargs = {k: v for k, v in kwargs.items() if v is not None}

    if len(kwargs) == 0:
        field_partner_list = serialize_list(FieldPartner.query.all())
    else:
        field_partner_list = serialize_list(
            FieldPartner.query.filter_by(**kwargs).all()
        )

    for field_partner in field_partner_list:
        field_partner["documents"] = serialize_list(
            Document.query.filter(Document.userID == field_partner["_id"]).all()
        )

    return create_response(data={"field_partner": field_partner_list})


@fp.route("/field_partner/<id>", methods=["GET"])
def get_fp_by_id(id):
    """ function that is called when you visit /field_partner/get/id/<id> that gets a field partner by id """
    field_partner_by_id = FieldPartner.query.get(id)
    return create_response(data={"field_partner": field_partner_by_id.to_dict()})


@fp.route("/field_partners", methods=["POST"])
def new_fp():
    """ function that is called when you visit /field_partner/new, creates a new FP """
    data = request.form.to_dict()
    if data is None:
        return create_response(status=400, message="No data provided for new FP")

    if "email" not in data:
        return create_response(status=400, message="No email provided for new FP")
    if "org_name" not in data:
        return create_response(
            status=400, message="No organization name provided for new FP"
        )
    if "pm_id" not in data:
        return create_response(status=400, message="No PM ID provided for new FP")
    if "app_status" not in data:
        return create_response(
            status=400, message="No application status provided for new FP"
        )

    pm_folder_id = PortfolioManager.query.get(data["pm_id"]).folder_id
    data["folder_id"] = create_folder(data["org_name"], pm_folder_id)

    data["due_date"] = time.time()
    new_fp = FieldPartner(data)
    res = new_fp.to_dict()

    db.session.add(new_fp)
    db.session.commit()

    return create_response(data={"field_partner": res})


@fp.route("/field_partner/<id>", methods=["PUT"])
def update_app_status(id):
    """ function that is called when you visit /field_partner/update/<id>, updates an FP's app status info """
    fp = FieldPartner.query.get(id)

    data = request.form

    if data is None:
        return create_response(status=400, message="No data provided to update FP")

    if "app_status" in data:
        fp.app_status = data.get("app_status")

    if "instructions" in data:
        fp.instructions = data.get("instructions")

    if "email" in data:
        fp.email = data.get("email")

    if "org_name" in data:
        fp.org_name = data.get("org_name")

    if "pm_id" in data:
        fp.pm_id = data.get("pm_id")

    if "due_date" in data:
        fp.due_date = data.get("due_date")

    ret = fp.to_dict()

    db.session.commit()
    return create_response(data={"field_partner": ret})
