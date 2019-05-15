from flask import Blueprint, request, current_app
from api.models import (
    Message,
    FieldPartner,
    PortfolioManager,
    Document,
    DocumentClass,
    db,
)
from flask_mail import Message as Flask_Message
from flask_mail import Mail
from api.core import create_response, serialize_list, logger
from enum import Enum
import os

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

    # Adds a field called name to each message
    for message in message_list:
        message.name = PortfolioManager.query.get(message.pm_id).name

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

    # Adds a field called name to each message
    for message in message_list:
        message.name = FieldPartner.query.get(message.fp_id).org_name

    return create_response(data={"messages": serialize_list(message_list)})


# TODO: Call this method every time something in the documents/fp/pm thing is changed
@message.route("/messages/new", methods=["POST"])
def add_message():
    data = request.form.to_dict()
    subjects = ["New required document", "Document reviewed", "Document uploaded"]

    # this doesn't entirely work because it also depends on what the notif is
    if "pm_id" not in data:
        if "fp_id" not in data:
            return create_response(
                status=400, message="No FP ID provided for new message"
            )
        data["pm_id"] = PortfolioManager.query.get(data["fp_id"]).id
    if "fp_id" not in data:
        if "pm_id" not in data:
            return create_response(
                status=400, message="No PM ID provided for new message"
            )
        data["fp_id"] = FieldPartner.query.get(data["pm_id"]).id

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

    docclass_name = DocumentClass.query.get(
        Document.query.get(data["doc_id"]).docClassID
    ).name
    status = data["status"]
    organization = FieldPartner.query.get(data["fp_id"]).org_name

    contents = [
        f"Your Portfolio Manager has added a new required document: {docclass_name}.",  # document class name
        f"Your document has been reviewed and was {status}.",  # status [approved/rejected]
        f"Your Field Partner from {organization} has uploaded a document for {docclass_name}.",  # organization, document class name
    ]
    # Add a field called "description" to the message
    data["description"] = contents[message_type.value]

    recipient = (
        FieldPartner.query.get(data["fp_id"])
        if data["to_fp"]
        else PortfolioManager.query.get(data["pm_id"])
    )

    mail = Mail(current_app)

    # TODO: change the sender hardcode
    email = Flask_Message(
        subject=subjects[message_type.value],
        sender=os.environ["GMAIL_NAME"],
        recipients=[recipient.email],
        body=contents[message_type.value],
    )
    mail.send(email)
    new_message = Message(data)
    ret = new_message.to_dict()

    db.session.add(new_message)
    db.session.commit()
    return create_response(data={"message": ret})
