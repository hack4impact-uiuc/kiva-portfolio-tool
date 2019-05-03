from api.core import Mixin
from .base import db
import uuid


class FieldPartner(Mixin, db.Model):
    """Field Partner Table."""

    __tablename__ = "field_partner"

    """FP ids start with f"""
    id = db.Column(db.String, unique=True, primary_key=True)
    email = db.Column(db.String)
    org_name = db.Column(db.String)
    pm_id = db.Column(db.String, db.ForeignKey("portfolio_manager.id"))
    date = db.Column(db.Date, unique=False, nullable=True)
    app_status = db.Column(
        db.Enum("New Partner", "In Process", "Complete", name="app_status")
    )

    def __init__(self, data):
        self.id = "f" + str(uuid.uuid4())

        # required fields should be checked for existence by the request
        self.email = data["email"]
        self.org_name = data["org_name"]
        self.pm_id = data["pm_id"]
        self.app_status = data["app_status"]

    def __repr__(self):
        return f"<Field Partner\nID: {self.id}\nApp Status: {self.app_status}\nEmail: {self.email}\nOrg Name: {self.org_name}\n:PM ID: {self.pm_id}\nDate: {self.date}>"
