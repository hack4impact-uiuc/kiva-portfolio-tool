from flask import Blueprint, request, json
from api.models import PortfolioManager, db
from api.core import create_response, serialize_list, logger
from api.views.auth import verify_token
from api.views.box import create_folder

pm = Blueprint("pm", __name__)  # initialize blueprint


@pm.route("/portfolio_managers", methods=["GET"])
def get_portfolio_manager():
    """ function that is called when you visit /portfolio_manager """

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)
    if info == "fp":
        return create_response(
            status=400, message="You do not have permission to create new documents!"
        )

    kwargs = {}
    kwargs["email"] = request.args.get("email")
    kwargs["name"] = request.args.get("name")

    kwargs = {k: v for k, v in kwargs.items() if v is not None}

    if len(kwargs) == 0:
        portfolio_manager_list = serialize_list(PortfolioManager.query.all())
    else:
        portfolio_manager_list = serialize_list(
            PortfolioManager.query.filter_by(**kwargs).all()
        )

    return create_response(data={"portfolio_manager": portfolio_manager_list})


@pm.route("/portfolio_manager/<id>", methods=["GET"])
def get_pm_by_id(id):
    """ function that is called when you visit /portfolio_manager/get/id/<id> that gets a portfolio manager by id """

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)

    if info == "fp":
        return create_response(
            status=400, message="You do not have permission to create new documents!"
        )

    portfolio_manager_by_id = PortfolioManager.query.get(id)
    return create_response(
        data={"portfolio_manager": portfolio_manager_by_id.to_dict()}
    )


@pm.route("/portfolio_managers", methods=["POST"])
def new_pm():
    """ function that is called when you visit /portfolio_manager/new, creates a new PM """

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)

    if info == "fp":
        return create_response(
            status=400, message="You do not have permission to create new documents!"
        )

    data = request.form.to_dict()

    if data is None:
        return create_response(status=400, message="No data provided for new FP")

    if "email" not in data:
        return create_response(status=400, message="No email provided for new PM")
    if "name" not in data:
        return create_response(status=400, message="No name provided for new PM")

    data["folder_id"] = create_folder(data["name"])

    new_pm = PortfolioManager(data)

    pm_dict = new_pm.to_dict()

    db.session.add(new_pm)
    db.session.commit()

    return create_response(data={"portfolio_manager": pm_dict})
