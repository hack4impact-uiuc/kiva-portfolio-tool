from api.core import Mixin
from .base import db


# Note that we use sqlite for our tests, so you can't use Postgres Arrays
class Document(Mixin, db.Model):
    """Document Table."""

    __tablename__ = "documents"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    fileID = db.Column(db.String, unique=True)
    userID = db.Column(
        db.String, unique=True
    )  # , db.ForeignKey("user.id",ondelete="SET NULL")
    date = db.Column(db.DateTime, unique=False, nullable=True)
    status = db.Column(db.String, unique=False)  # db.Enum
    docType = db.Column(db.String, unique=False)  # db.Enum
    docName = db.Column(db.String, unique=False, nullable=True)
    latest = db.Column(db.Boolean, unique=False, nullable=True)
    description = db.Column(db.String, unique=False, nullable=True)

    def __init__(
        self, fileID, userID, date, status, docType, docName, latest, description
    ):
        self.fileID = fileID
        self.userID = userID
        self.date = date
        self.status = status
        self.docType = docType
        self.docName = docName
        self.latest = latest
        self.description = description

    def __repr__(self):
        return f"<FileID: {self.fileID}>\n <userID: {self.userID}>\n <date: {self.date}>\n <status: {self.status}>\n <docType: {self.docType}>\n <docName {self.docName}>\n <latest {self.latest}>\n <description: {self.description}>\n"
