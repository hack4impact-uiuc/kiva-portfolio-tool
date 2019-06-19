from api.core import Mixin
from .base import db
import uuid


# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Document(Mixin, db.Model):
    """Document Table."""

    __tablename__ = "documents"

    id = db.Column(db.String, unique=True, primary_key=True)
    fileID = db.Column(db.String, unique=True, nullable=True)
    userID = db.Column(db.String)  # , db.ForeignKey("user.id",ondelete="SET NULL")
    status = db.Column(
        db.Enum("Pending", "Approved", "Missing", "Rejected", name="status"),
        unique=False,
    )  # db.Enum
    docClassID = db.Column(
        db.String, db.ForeignKey("document_class.id"), nullable=False
    )
    fileName = db.Column(db.String, unique=False, nullable=True)
    link = db.Column(db.String, unique=False, nullable=True)
    folderID = db.Column(db.String)
    version = db.Column(db.Integer)

    # use dictionary to load params to avoid weird issue with values being placed in lists
    def __init__(self, data):

        # required fields should be checked for existence by the request
        self.id = str(uuid.uuid4())
        self.userID = data["userID"]
        self.status = data["status"]
        self.docClassID = data["docClassID"]

        # if no folderID provided, default to "0"
        self.folderID = data["folderID"] if "folderID" in data else "0"

        # optional fields checked manually
        if "fileID" in data:
            self.fileID = data["fileID"]
        if "fileName" in data:
            self.fileName = data["fileName"]
        if "link" in data:
            self.link = data["link"]
        self.version = 0

    def __repr__(self):
        return f"<ID: {self.id}>\n <FileID: {self.fileID}>\n <userID: {self.userID}>\n <status: {self.status}>\n <docClassID: {self.docClassID}>\n <fileName {self.fileName}>\n  <link: {self.link}>\n <folderID: {self.folderID}> \n<version: {self.version}>\n"

    def get_docclass_id(self):
        return self.docClassID
