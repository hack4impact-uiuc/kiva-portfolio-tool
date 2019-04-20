#!/usr/bin/env python3

from flask import Flask
from flask_mail import Mail, Message
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from api import create_app

import os

# sets up the app
app = create_app()

mail_settings = {
    "MAIL_SERVER": "smtp.gmail.com",
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": os.environ["GMAIL_USER"],
    "MAIL_PASSWORD": os.environ["GMAIL_PASSWORD"],
}

app.config.update(mail_settings)
mail = Mail(app)

if __name__ == "__main__":
    with app.app_context():
        msg = Message(
            subject="Hello",
            sender=app.config.get("MAIL_USERNAME"),
            recipients=["otakuness3@gmail.com"],  # replace with your email for testing
            body="This is the second email i'm sending from gmail smtp something something",
        )
        mail.send(msg)
