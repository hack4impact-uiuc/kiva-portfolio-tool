from flask import Blueprint, request, json
from api.models import PortfolioManager, db
from api.core import create_response, serialize_list, logger

pm = Blueprint("pm", __name__)  # initialize blueprint


@pm.route("/portfolio_manager", methods=["GET"])
def get_portfolio_manager():
    """ function that is called when you visit /portfolio_manager """
    portfolio_manager = PortfolioManager.query.all()
    return create_response(
        data={"portfolio_manager": serialize_list(portfolio_manager)}
    )


@pm.route("/portfolio_manager/<id>", methods=["GET"])
def get_pm_by_id(id):
    """ function that is called when you visit /portfolio_manager/get/id/<id> that gets a portfolio manager by id """
    portfolio_manager_by_id = PortfolioManager.query.get(id)
    return create_response(
        data={"portfolio_manager": portfolio_manager_by_id.to_dict()}
    )


@pm.route("/portfolio_manager/email/<email>", methods=["GET"])
def get_pm_by_email(email):
    """ function that is called when you visit /portfolio_manager/<email>, gets a PM by email """
    portfolio_manager_by_email = PortfolioManager.query.filter(
        PortfolioManager.email == email
    )
    return create_response(
        data={"portfolio_manager": serialize_list(portfolio_manager_by_email)}
    )


@pm.route("/portfolio_manager/all_fps/<id>", methods=["GET"])
def get_all_fps(id):
    """ function that is called when you visit /portfolio_manager/all_fps/<id> that gets a portfolio manager by id """
    pm_by_id = PortfolioManager.query.get(id)
    return create_response(data={"list_of_fps": pm_by_id.list_of_fps})


@pm.route("/portfolio_manager/new", methods=["POST"])
def new_pm():
    """ function that is called when you visit /portfolio_manager/new, creates a new PM """
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


@pm.route("/portfolio_manager/<pm_id>/<fp_id>", methods=["PUT"])
def add_fp(pm_id, fp_id):
    """ function that is called when you visit /portfolio_manager/add/<pm_id>/<fp_id>, adds an existing FP to the PM's list of FPs """
    pm = PortfolioManager.query.get(pm_id)
    pm.list_of_fps = pm.list_of_fps + [fp_id]
    db.session.commit()
    return create_response(data={"list_of_fps": pm.list_of_fps})
