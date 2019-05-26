from api.core import Mixin
from .base import db
import uuid
import datetime

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Message(Mixin, db.Model):
    """Message Table."""

    __tablename__ = "message"

    id = db.Column(db.String, unique=True, primary_key=True)
    pm_id = db.Column(db.String, db.ForeignKey("portfolio_manager.id"), nullable=True)
    fp_id = db.Column(db.String, db.ForeignKey("field_partner.id"))
    # true if send to fp; false if send to pm
    to_fp = db.Column(db.Boolean)

    # These are all nullable depending on the type of notification
    doc_id = db.Column(db.String, db.ForeignKey("documents.id"), nullable=True)
    description = db.Column(db.String, nullable=True)
    time = db.Column(db.String)

    def __init__(self, data):

        self.id = str(uuid.uuid4())
        # required fields should be checked for existence by the request
        self.pm_id = data["pm_id"]
        self.fp_id = data["fp_id"]
        self.to_fp = data["to_fp"]
        self.doc_id = data["doc_id"]
        self.description = data["description"]
        self.time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # optional fields checked manually
        if "comment" in data:
            self.comment = (
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                + ": "
                + data["comment"]
            )

    def __repr__(self):
        return f"<Message\nID: {self.id}\nPM ID: {self.pm_id}\n FP ID: {self.fp_id}\n To FP: {self.to_fp}\n Doc ID: {self.doc_id}\n Time: {self.time}>\n Description: {self.description}>\n  "

    def get_pm_id(self):
        return self.pm_id

    def get_fp_id(self):
        return self.fp_id

    def get_id_bool(self):
        return self.to_fp

    def get_doc_id(self):
        return self.doc_id

    def get_comment(self):
        return self.comment

    def set_comment(self, comment):
        self.comment += (
            "\n" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + comment
        )
