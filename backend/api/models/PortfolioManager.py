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
    list_of_fps = db.Column(ARRAY(db.String), nullable=True)

    def __init__(self, email, name, list_of_fps):
        self.id = "p" + str(uuid.uuid4())
        self.email = email
        self.name = name
        self.list_of_fps = list_of_fps

    def __repr__(self):
        return f"<Portfolio Manager\nID: {self.id}\nEmail: {self.email}\nName: {self.name}\nList of FPs: {self.list_of_fps}>"
