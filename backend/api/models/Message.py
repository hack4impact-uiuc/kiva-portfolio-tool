from api.core import Mixin
from .base import db

import datetime

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Message(Mixin, db.Model):
    """Message Table."""

    __tablename__ = "message"

    pm_id = db.Column(db.String, db.ForeignKey("portfolio_manager.id"))
    fp_id = db.Column(db.String, db.ForeignKey("field_partner.id"))
    to_fp = db.Column(db.Boolean)  # true if send to fp; false if send to pm

    doc_id = db.Column(db.Integer, unique=True, primary_key=True)
    status = db.Column(db.String, unique=True)
    comment = db.Column(db.String, nullable=True)

    def __init__(self, data):

        # required fields should be checked for existence by the request
        self.pm_id = data["pm_id"]
        self.fp_id = data["fp_id"]
        self.to_fp = data["to_fp"]
        self.doc_id = data["doc_id"]
        self.status = data["status"]

        # optional fields checked manually
        if "comment" in data:
            self.comment = (
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                + ": "
                + data["comment"]
            )

    def __repr__(self):
        return f"<Message {self.comment}>"

    def get_pm_id(self):
        return self.pm_id

    def get_fp_id(self):
        return self.fp_id

    def get_id_bool(self):
        return self.to_fp

    def get_doc_id(self):
        return self.doc_id

    def get_status(self):
        return self.status

    def set_status(self, new_status):
        self.status = new_status

    def get_comment(self):
        return self.comment

    def set_comment(self, comment):
        self.comment += (
            "\n" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + comment
        )
