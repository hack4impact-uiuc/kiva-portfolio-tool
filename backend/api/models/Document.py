from api.core import Mixin
from .base import db


# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Document(Mixin, db.Model):
    """Document Table."""

    __tablename__ = "documents"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    fileID = db.Column(db.String, unique=True, nullable=True)
    userID = db.Column(db.String)  # , db.ForeignKey("user.id",ondelete="SET NULL")
    date = db.Column(db.DateTime, unique=False, nullable=True)
    status = db.Column(
        db.Enum("Pending", "Approved", "Missing", "Rejected", name="status"),
        unique=False,
    )  # db.Enum
    docClassID = db.Column(
        db.String, db.ForeignKey("document_class.id"), nullable=False
    )
    fileName = db.Column(db.String, unique=False)
    latest = db.Column(db.Boolean, unique=False, nullable=True)
    description = db.Column(db.String, unique=False, nullable=True)

    def __init__(
        self,
        userID,
        docClassID,
        file=None,
        fileID=None,
        date=None,
        status="Missing",
        fileName=None,
        latest=None,
        description=None,
    ):
        self.fileID = fileID
        self.userID = userID
        self.date = date
        self.status = status
        self.docClassID = docClassID
        self.fileName = fileName
        self.latest = latest
        self.description = description

    def __repr__(self):
        return f"<FileID: {self.fileID}>\n <userID: {self.userID}>\n <date: {self.date}>\n <status: {self.status}>\n <docClassID: {self.docClassID}>\n <fileName {self.fileName}>\n <latest {self.latest}>\n <description: {self.description}>\n"

    def get_docclass_id(self):
        return self.docClassID
