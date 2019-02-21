from flask import Blueprint, request
from api.models.Message import Message
from api.core import create_response, serialize_list, logger

business = Blueprint("message", __name__)


@message.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.all()
    return create_response(data={"messages": serialize_list(messages)})
