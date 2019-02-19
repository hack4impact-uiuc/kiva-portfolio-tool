from api.core import Mixin
from .base import db

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class PortfolioManager(Mixin, db.Model):
    """Portfolio Manager Table."""

    __tablename__ = "portfolio manager table"

    """ PM ids start with p"""
    id = db.Column(db.String, unique=True, primary_key=True)
    email = db.Column(db.String)
    name = db.Column(db.String)
    listOfFPs = db.Column(db.Array, nullable=True)

    def __init__(self, email, name, listOfFPs):
        self.email = email
        self.name = name
        self.listOfFPs = listOfFPs

    def __repr__(self):
        return f"<Portfolio Manager\nID: {self.id}\nEmail: {self.email}\nName: {self.name}\nList of FPs: {self.listOfFPs}>"