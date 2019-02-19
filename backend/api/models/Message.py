from api.core import Mixin
from .base import db

import datetime

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Message(Mixin, db.Model):
    """Message Table."""

    __tablename__ = "message"

    pm_id = db.Column(
        db.String, db.ForeignKey("PortfolioManager.id"), nullable=True
    )
    fp_id = db.Column(
        db.String, db.ForeignKey("FieldPartner.id"), nullable=True
    )
    to_fp = db.Column(db.Boolean)   # true if send to fp; false if send to pm
    doc_id = db.Column(db.Integer, unique=True)
    status = db.Column(db.String, unique=True)
    comment = db.Column(db.String, nullable=True)

    def __init__(self, pm_id, fp_id, to_fp, doc_id, status, comment):
        self.pm_id = pm_id
        self.fp_id = fp_id
        self.to_fp = to_fp
        self.doc_id = doc_id
        self.status = status
        self.comment = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + comment

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
        self.comment += ('\n' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + comment)