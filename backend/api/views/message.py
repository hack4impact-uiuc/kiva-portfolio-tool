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


@message.route("/messages/pm/<fp_id>", methods=["GET"])
def get_messages_by_pm(fp_id):
    """
    Gets a list of messages/notifications relevant to a specific PM
    """
    pm_id = FieldPartner.query.get(fp_id).pm_id

    message_list = (
        Message.query.filter(Message.pm_id == pm_id)
        .filter(Message.to_fp == False)
        .all()
    )

    # Adds a field called name to each message, but there might not be a fp_id
    for message in message_list:
        if message.fp_id:
            message.name = FieldPartner.query.get(message.fp_id).org_name

    return create_response(data={"messages": serialize_list(message_list)})


@message.route("/messages/new", methods=["POST"])
def add_message():
    data = request.form.to_dict()
    subjects = [
        "[Kiva] New required document",
        "[Kiva] Document reviewed",
        "[Kiva] Document uploaded",
    ]

    # If to_fp is true, then this notification is meant for the fp
    if "to_fp" not in data:
        return create_response(
            status=400, message="No boolean to_fp provided for new message"
        )

    # Get a PM id if it's not provided
    if "pm_id" not in data:
        if "fp_id" not in data:
            return create_response(
                status=400, message="No FP or PM ID provided for new message"
            )
        data["pm_id"] = FieldPartner.query.get(data["fp_id"]).pm_id

    # Because we can't get the FP ID from PM, we need the FP ID explicity when it's to FP
    # Otherwise, the fp_id field can be empty
    if "fp_id" not in data and data.to_fp:
        return create_response(
            status=400, message="No FP ID provided for new message to FP"
        )

    if "doc_id" not in data:
        return create_response(
            status=400, message="No document ID provided for new message"
        )

    # Default to reviewed because it has 2 statuses
    message_type = MessageType.REVIEWED_DOC

    # Using statuses to determine the message type, lowercasing for message
    status = Document.query.get(data["doc_id"]).status.lower()
    if status == "missing":
        message_type = MessageType.NEW_DOC
    if status == "pending":
        message_type = MessageType.UPLOADED_DOC

    # Getting names for the message contents
    docclass_name = DocumentClass.query.get(
        Document.query.get(data["doc_id"]).docClassID
    ).name

    organization = ""
    if "fp_id" in data:
        organization = FieldPartner.query.get(data["fp_id"]).org_name

    contents = [
        f"Your Portfolio Manager has added a new required document: {docclass_name}.",  # document class name
        f"Your document, {docclass_name}, has been reviewed and was {status}.",  # document class name, status [approved/rejected]
        f"Your Field Partner from {organization} has uploaded a document for {docclass_name}.",  # organization, document class name
    ]

    # Add the contents as a description field
    data["description"] = contents[message_type.value]

    recipient = (
        FieldPartner.query.get(data["fp_id"])
        if data["to_fp"] == "true"
        else PortfolioManager.query.get(data["pm_id"])
    )

    # Send the email
    mail = Mail(current_app)

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
