from api.core import Mixin
from .base import db
from sqlalchemy.dialects.postgresql import ARRAY
import uuid


class PortfolioManager(Mixin, db.Model):
    """Portfolio Manager Table."""

    __tablename__ = "portfolio_manager"

    """ PM ids start with p"""
    id = db.Column(db.String, unique=True, primary_key=True)
    email = db.Column(db.String)
    name = db.Column(db.String)
    role = db.Column(db.String)

    def __init__(self, data):
        self.id = "p" + str(uuid.uuid4())

        # required fields should be checked for existence by the request
        self.email = data["email"]
        self.name = data["name"]
        self.role = "pm"

    def __repr__(self):
        return f"<Portfolio Manager\nID: {self.id}\nEmail: {self.email}\nName: {self.name}\nRole: {self.role}\n>"
