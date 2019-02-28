# this file structure follows http://flask.pocoo.org/docs/1.0/patterns/appfactories/
# initializing db in api.models.base instead of in api.__init__.py
# to prevent circular dependencies
from .Email import Email
from .Person import Person
from .Message import Message
from .base import db
from .Document import Document
from .PortfolioManager import PortfolioManager
from .FieldPartner import FieldPartner

__all__ = [
    "Email",
    "Person",
    "db",
    "Document",
    "Message",
    "FieldPartner",
    "PortfolioManager",
]

# You must import all of the new Models you create to this page
