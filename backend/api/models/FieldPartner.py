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
    app_status = db.Column(
        db.Enum("New Partner", "In Process", "Complete", name="app_status")
    )
    instructions = db.Column(db.String)
    folder_id = db.Column(db.String)
    due_date = db.Column(db.BigInteger, unique=False)

    def __init__(self, data):
        self.id = "f" + str(uuid.uuid4())

        # required fields should be checked for existence by the request
        self.email = data["email"]
        self.org_name = data["org_name"]
        self.pm_id = data["pm_id"]
        self.app_status = data["app_status"]
        self.due_date = int(data["due_date"])

        # upon construction, default to empty instructions
        self.instructions = ""

        # if no folderID provided, default to "0"
        self.folder_id = data["folder_id"] if "folder_id" in data else "0"

    def __repr__(self):
        return f"<Field Partner\nID: {self.id}\nApp Status: {self.app_status}\nEmail: {self.email}\nOrg Name: {self.org_name}\n PM ID: {self.pm_id}\n Due Date: {self.due_date}\n Instructions: {self.instructions}\n Folder ID: {self.folder_id}\n>"
