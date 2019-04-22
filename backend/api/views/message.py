from flask import Blueprint, request
from api.models.Message import Message
from api.core import create_response, serialize_list, logger

message = Blueprint("message", __name__)


@message.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.all()
    return create_response(data={"messages": serialize_list(messages)})

@message.route("/messages/delete/<id>")
def delete_message(id):
    """
    Deletes the message with a given id
    """
    db.session.delete(Message.query.get(id))
    db.session.commit()
    return create_response(status=200, message="success")

def add_message(data):
    if (
        "pm_id" not in data
        or "fp_id" not in data
        or "to_fp" not in data
        or "doc_id" not in data
        or "status" not in data
    ):
        # Throw an error?
        return False
    new_message = Message(data)
    db.session.add()
    db.session.commit()
    # Then send an email
