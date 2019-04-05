from api.core import Mixin
from .base import db
import uuid

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class DocumentClass(Mixin, db.Model):
    """Document Class Table."""

    __tablename__ = "document_class"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String, unique=False, nullable=True)

    def __init__(self, name, description=None):
        self.id =  str(uuid.uuid4());
        self.name = name
        self.description = description

    def __repr__(self):
        return f"<name: {self.name}>\n <description: {self.description}>\n"
