from flask import Blueprint, request, current_app
from api.models import Message, FieldPartner, PortfolioManager, db
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


@message.route("/messages/fp/<fp_id>", methods=["GET"])
def get_messages_by_fp(fp_id):
    """
    Gets a list of messages/notifications relevant to a specific FP
    """
    message_list = (
        Message.query.filter(Message.fp_id == fp_id).filter(Message.to_fp == True).all()
    )
    return create_response(data={"messages": serialize_list(message_list)})


@message.route("/messages/pm/<pm_id>", methods=["GET"])
def get_messages_by_pm(pm_id):
    """
    Gets a list of messages/notifications relevant to a specific PM
    """
    message_list = (
        Message.query.filter(Message.pm_id == pm_id)
        .filter(Message.to_fp == False)
        .all()
    )
    return create_response(data={"messages": serialize_list(message_list)})


# TODO: Call this method every time something in the documents/fp/pm thing is changed
@message.route("/messages/new", methods=["POST"])
def add_message():
    data = request.form
    subjects = ["New required document", "Document reviewed", "Document uploaded"]
    contents = [
        "Your Portfolio Manager has added a new required document: [documentclass name]",
        "Your document has been reviewed and was [status, approved/rejected]",
        "Your Field Partner from [organization] has uploaded a document for [documentclass name]",
    ]

    # these are endpoint things, but we're not calling an endpoint- unless we are?
    # basically the thing is you could just put this in apiwrapper and call the endpoint and pass the user to this, which woud be so much easier so let's make it an endpoint again
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
    temp_message = Message(data)
    db.session.add(temp_message)
    db.session.commit()

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
    recipient_list = FieldPartner.query.filter(FieldPartner.id == data["fp_id"]).all()
    recipient_list = PortfolioManager.query.filter(
        PortfolioManager.id == data["pm_id"]
    ).all()
    mail = Mail(current_app)
    email = Flask_Message(
        subject=subjects[message_type],
        sender="ky.cu303@gmail.com",
        recipients=recipient_list,
        body=contents[message_type],
    )
    mail.send(email)
    new_message = Message(data)

    db.session.add()
    db.session.commit()
    return create_response(status=200, message="success")
