from flask import Blueprint, request, json
from api.models import FieldPartner, PortfolioManager, db
from api.core import create_response, serialize_list, logger

import requests, json

fp = Blueprint("fp", __name__)


@fp.route("/field_partner", methods=["GET"])
def get_field_partner():
    """ function that is called when you visit /field_partner, gets all the FPs """
    field_partner = FieldPartner.query.all()
    return create_response(data={"field_partner": serialize_list(field_partner)})


@fp.route("/field_partner/id/<id>", methods=["GET"])
def get_fp_by_id(id):
    """ function that is called when you visit /field_partner/get/id/<id> that gets a field partner by id """
    field_partner_by_id = FieldPartner.query.get(id)
    return create_response(data={"field_partner": field_partner_by_id.to_dict()})


@fp.route("/field_partner/email/<email>", methods=["GET"])
def get_fp_by_email(email):
    """ function that is called when you visit /field_partner/get/email/<email>, gets an FP by email """
    field_partner_by_email = FieldPartner.query.filter(FieldPartner.email == email)
    return create_response(
        data={"field_partner": serialize_list(field_partner_by_email)}
    )


@fp.route("/field_partner/org_name/<id>", methods=["GET"])
def get_org_by_id(id):
    """ function that is called when you visit _____, gets an FP's org name by ID """
    fp_by_id = FieldPartner.query.get(id)
    return create_response(data={"org_name": fp_by_id.org_name})


@fp.route("/field_partner/pm/<pm_id>", methods=["GET"])
def get_fp_by_pm(pm_id):
    """ function that is called when you visit /field_partner/get/pm/<pm_id>, filters FPs by PM IDs """
    field_partner_list = FieldPartner.query.filter(FieldPartner.pm_id == pm_id).all()
    return create_response(data={"field_partner": serialize_list(field_partner_list)})


@fp.route("/field_partner/new", methods=["POST"])
def new_fp():
    """ function that is called when you visit /field_partner/new, creates a new FP """
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


@fp.route("/field_partner/update/<id>", methods=["PUT"])
def update_app_status(id):
    """ function that is called when you visit /field_partner/update/<id>, updates an FP's app status info """
    fp = FieldPartner.query.get(id)
    fp.app_status = request.get_json().get("app_status", "")
    ret = fp.to_dict()

    db.session.commit()
    return create_response(data={"field_partner": ret})
