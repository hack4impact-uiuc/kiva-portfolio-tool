from flask import Blueprint, request, current_app
from api.models.Message import Message
from api.models.FP import FP
from api.models.PM import PM
from flask_mail import Message as Flask_Message
from flask_mail import Mail
from api.core import create_response, serialize_list, logger
from enum import Enum

message = Blueprint("message", __name__)


class MessageType(Enum):
    NEW_DOC = 0
    REVIEWED_DOC = 1
    UPLOADED_DOC = 2


@message.route("/messages", methods=["GET"])
def get_messages():
    messages = Message.query.all()
    return create_response(data={"messages": serialize_list(messages)})


@message.route("/messages/delete/<id>", methods=["DELETE"])
def delete_message(id):
    """
    Deletes the message with a given id
    """
    db.session.delete(Message.query.get(id))
    db.session.commit()
    return create_response(status=200, message="success")


@message.route("/messages/fp/<fp_id>", methods=["GET"])
def get_messages_by_fp(fp_id):
    """
    Gets a list of messages/notifications relevant to a specific FP
    """
    message_list = Message.query.filter(Message.fp_id == fp_id and Message.to_fp).all()
    return create_response(data={"messages": serialize_list(message_list)})


@message.route("/messages/pm/<pm_id>", methods=["GET"])
def get_messages_by_pm(pm_id):
    """
    Gets a list of messages/notifications relevant to a specific PM
    """
    message_list = Message.query.filter(
        Message.pm_id == pm_id and not Message.to_fp
    ).all()
    return create_response(data={"messages": serialize_list(message_list)})


@message.route("/messages/new", methods=["POST"])
def add_message(data):
    subjects = ["New required document", "Document reviewed", "Document uploaded"]
    contents = [
        "jdsklfjslkdfjslkdjf",
        "Your document has been reviewed and [status]",
        "[FP] has uploaded a document for [document name]",
    ]

    if "pm_id" not in data:
        return create_response(status=400, message="No PM ID provided for new message")
    if "fp_id" not in data:
        return create_response(status=400, message="No FP ID provided for new message")
    # If to_fp is true, then this notification is meant for the fp
    if "to_fp" not in data:
        return create_response(
            status=400, message="No boolean to_fp provided for new message"
        )

    # This might not be necessary if we're not notifying on due dates
    if "doc_id" not in data:
        return create_response(
            status=400, message="No document ID provided for new message"
        )

    # Default to reviewed because it has 2 statuses
    message_type = MessageType.REVIEWED_DOC
    # Using statuses to determine the message type
    if "status" in data:
        if data["status"] == "Missing":
            message_type = MessageType.NEW_DOC
        if data["status"] == "Pending":
            message_type = MessageType.UPLOADED_DOC

    # Send a message
    # TODO: find sender and recipient emails
    mail = Mail(current_app)
    email = Flask_Message(
        subject=subjects[message_type],
        sender="ky.cu303@gmail.com",
        recipients=["otakuness3@gmail.com"],
        body=contents[message_type],
    )
    mail.send(email)
    new_message = Message(data)

    db.session.add()
    db.session.commit()
    return create_response(status=200, message="success")
