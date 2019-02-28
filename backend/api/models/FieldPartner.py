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
    app_status = db.Column(db.String)

    def __init__(self, email, org_name, pm_id, app_status):
        self.id = "f" + str(uuid.uuid4())
        self.email = email
        self.org_name = org_name
        self.pm_id = pm_id
        self.app_status = app_status

    def __repr__(self):
        return f"<Field Partner\nID: {self.id}\nEmail: {self.email}\nOrg Name: {self.org_name}\n:PM ID: {self.pm_id}\nApp Status: {self.app_status}>"
