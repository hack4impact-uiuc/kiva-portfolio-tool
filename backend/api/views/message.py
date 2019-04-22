from flask import Blueprint, request, current_app
from api.models.Message import Message
from flask_mail import Message as Flask_Message
from flask_mail import Mail
from api.core import create_response, serialize_list, logger

message = Blueprint("message", __name__)


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


@message.route("/messages/sendemail", methods=["GET"])
def add_message():
    # if (
    #     "pm_id" not in data
    #     or "fp_id" not in data
    #     or "to_fp" not in data
    #     or "doc_id" not in data
    #     or "status" not in data
    # ):
    #     # Throw an error?
    #     return False

    # Send a message
    mail = Mail(current_app)
    email = Flask_Message(
        subject="Hello",
        sender="ky.cu303@gmail.com",
        recipients=["otakuness3@gmail.com"],
        body="testing sending email from an endpoint",
    )
    mail.send(email)
    return create_response(status=200, message="success")
    # new_message = Message(data)

    # db.session.add()
    # db.session.commit()
    # Then send an email
