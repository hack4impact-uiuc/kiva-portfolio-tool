from api.core import Mixin
from .base import db

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class FieldPartner(Mixin, db.Model):
    """Field Partner Table."""

    __tablename__ = "field partner table"

    """FP ids start with f"""
    id = db.Column(db.String, unique=True, primary_key=True)
    email = db.Column(db.String)
    org_name = db.Column(db.String)
    pm_id = db.Column(db.String, db.ForeignKey("PortfolioManager.id"))
    app_status = db.Colulmn(db.String)

    def __init__(self, email, org_name, app_status):
        self.email = email
        self.org_name = org_name
        self.app_status = app_status

    def __repr__(self):
        return f"<Field Partner\nID: {self.id}\nEmail: {self.email}\nOrg Name: {self.org_name}\n:PM ID: {self.pm_id}\nApp Status: {self.app_status}>"
