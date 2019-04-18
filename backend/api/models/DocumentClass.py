from api.core import Mixin
from .base import db
import uuid

# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class DocumentClass(Mixin, db.Model):
    """Document Class Table."""

    __tablename__ = "document_class"

    id = db.Column(db.String, unique=True, primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String, unique=False, nullable=True)
    example = db.Column(db.String, unique=False, nullable=True)
    # an example of this Document Class, represented by a shared Box link

    def __init__(self, data):

        # required fields should be checked for existence by the request
        self.id = str(uuid.uuid4())
        self.name = data["name"]

        # optional fields checked manually
        if "description" in data:
            self.description = data["description"]
        if "example" in data:
            self.example = data["example"]

    def __repr__(self):
        return f"<Document Class\nID: {self.id}\nname: {self.name}>\n <description: {self.description}>\n <example: {self.example}>\n"
