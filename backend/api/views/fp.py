from flask import Blueprint, request, json
from api.models import FieldPartner, db
from api.core import create_response, serialize_list, logger

import requests, json

fp = Blueprint("fp", __name__)


@fp.route("/field_partner", methods=["GET"])
def get_field_partner():
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner, gets all the FPs """
    field_partner = FieldPartner.query.all()
    return create_response(data={"field_partner": serialize_list(field_partner), "role": role})


@fp.route("/field_partner/<id>", methods=["GET"])
def get_fp_by_id(id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner/get/id/<id> that gets a field partner by id """
    field_partner_by_id = FieldPartner.query.get(id)
    return create_response(data={"field_partner": field_partner_by_id.to_dict(), "role": role})


@fp.route("/field_partner/email/<email>", methods=["GET"])
def get_fp_by_email(email):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner/get/email/<email>, gets an FP by email """
    field_partner_by_email = FieldPartner.query.filter(FieldPartner.email == email)
    return create_response(
        data={"field_partner": serialize_list(field_partner_by_email), "role": role}
    )


@fp.route("/field_partner/org_name/<id>", methods=["GET"])
def get_org_by_id(id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit _____, gets an FP's org name by ID """
    fp_by_id = FieldPartner.query.get(id)
    return create_response(data={"org_name": fp_by_id.org_name, "role" : role})


@fp.route("/field_partner/pm/<pm_id>", methods=["GET"])
def get_fp_by_pm(pm_id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner/get/pm/<pm_id>, filters FPs by PM IDs """
    field_partner_list = FieldPartner.query.filter(FieldPartner.pm_id == pm_id).all()
    return create_response(data={"field_partner": serialize_list(field_partner_list), "role": role})


@fp.route("/field_partner/new", methods=["POST"])
def new_fp():
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner/new, creates a new FP """
    data = request.get_json()

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
    sample_args = request.args
    new_fp = FieldPartner(**data)
    return create_response(data={"field_partner": new_fp.to_dict(), "role": role})


@fp.route("/field_partner/update/<id>", methods=["PUT"])
def update_app_status(id):
    data = request.get_json()
    headers = data["headers"]
    
    response, role = verify_token(headers['token'])

    if response is not None:
        return response

    """ function that is called when you visit /field_partner/update/<id>, updates an FP's app status info """
    fp = FieldPartner.query.get(id)
    fp.app_status = request.get_json().get("app_status", "")
    ret = fp.to_dict()

    db.session.commit()
    return create_response(data={"field_partner": ret, "role": role})

def verify_token(token):
    """ helper function that verifies the token sent from client and returns an appropriate response and the permission/role (if it exists)"""
    
    if token is None:
        return create_response(status=400, message="Token is required."), None 
    
    r = requests.post("http://localhost:8000/verify", headers={'token': headers['token']})
    res = r.json()

    if res["status"] == 400:
        return create_response(status=400, message=res["message"]), None

    return None, res["permission"]
