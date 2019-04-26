from api.core import Mixin
from .base import db


# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Document(Mixin, db.Model):
    """Document Table."""

    __tablename__ = "documents"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    fileID = db.Column(db.String, unique=True, nullable=True)
    userID = db.Column(db.String)  # , db.ForeignKey("user.id",ondelete="SET NULL")
    date = db.Column(db.Date, unique=False, nullable=True)
    status = db.Column(
        db.Enum("Pending", "Approved", "Missing", "Rejected", name="status"),
        unique=False,
    )  # db.Enum
    docClassID = db.Column(
        db.String, db.ForeignKey("document_class.id"), nullable=False
    )
    fileName = db.Column(db.String, unique=False, nullable=True)
    latest = db.Column(db.Boolean, unique=False, nullable=True)
    description = db.Column(db.String, unique=False, nullable=True)
    link = db.Column(db.String, unique=False, nullable=True)

    # use dictionary to load params to avoid weird issue with values being placed in lists
    def __init__(self, data):

        # required fields should be checked for existence by the request
        self.userID = data["userID"]
        self.status = data["status"]
        self.docClassID = data["docClassID"]

        # optional fields checked manually
        if "date" in data:
            self.date = data["date"]
        if "fileID" in data:
            self.fileID = data["fileID"]
        if "fileName" in data:
            self.fileName = data["fileName"]
        if "latest" in data:
            self.latest = data["latest"]
        if "description" in data:
            self.description = data["description"]
        if "link" in data:
            self.link = data["link"]

    def __repr__(self):
        return f"<FileID: {self.fileID}>\n <userID: {self.userID}>\n <date: {self.date}>\n <status: {self.status}>\n <docClassID: {self.docClassID}>\n <fileName {self.fileName}>\n <latest {self.latest}>\n <description: {self.description}>\n <link: {self.link}>\n"

    def get_docclass_id(self):
        return self.docClassID
