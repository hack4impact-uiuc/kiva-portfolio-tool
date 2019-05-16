from flask import Blueprint, request, json
from api.models import Document, Message, db, DocumentClass, FieldPartner
from api.views.box import upload_file
from api.core import create_response, serialize_list, logger
from api.views.auth import verify_token

document = Blueprint("document", __name__)


@document.route("/document", methods=["GET"])
def get_document():
    """
    Gets all documents that can be specified using a query string
    """
    # gets database values from query string, if missing is None
    kwargs = {}
    kwargs["fileID"] = request.args.get("fid")
    kwargs["userID"] = request.args.get("uid")
    kwargs["status"] = request.args.get("status")
    kwargs["docClassID"] = request.args.get("docClassID")
    kwargs["fileName"] = request.args.get("fileName")
    kwargs["latest"] = request.args.get("latest")

    # stores date and time for parse searching
    date = request.args.get("date")
    description = request.args.get("description")

    # refines kwargs to remove all the None values and only search by values provided
    kwargs = {k: v for k, v in kwargs.items() if v is not None}

    # if no search parameters provided return all documents
    if len(kwargs) == 0:
        docs = Document.query.all()

        # Since description and date were not part of search parameters
        # this is so that partial querying can be use to search keywords in description
        # and to allow searching by day of week rather than exact date
        # refines searches by date and description
        if description is not None:
            docs = [
                i
                for i in docs
                if i.description is not None
                and description.lower() in i.description.lower()
            ]
        if date is not None:
            docs = [i for i in docs if date.lower() in str(i.date).lower()]

        # Adds a field called docClassName to each document
        for doc in docs:
            doc.docClassName = DocumentClass.query.get(doc.docClassID).name

        # separate documents by different statuses and return based on this
        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Approved"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]
        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Approved": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )
    # if there are query arguments the following occurs
    else:
        # Unpacks the search values in our dictionary and provides them to Flask/SQLalchemy
        docs = Document.query.filter_by(**kwargs).all()

        # Since description and date were not part of search parameters
        # this is so that partial querying can be use to search keywords in description
        # and to allow searching by day of week rather than exact date
        # refines searches by date and description
        if description is not None:
            docs = [
                i
                for i in docs
                if i.description is not None
                and description.lower() in i.description.lower()
            ]
        if date is not None:
            docs = [i for i in docs if date.lower() in str(i.date).lower()]

        for doc in docs:
            doc.docClassName = DocumentClass.query.get(doc.docClassID).name

        # separate documents by different statuses and return based on this
        pending = [i for i in docs if i.status == "Pending"]
        verified = [i for i in docs if i.status == "Approved"]
        missing = [i for i in docs if i.status == "Missing"]
        rejected = [i for i in docs if i.status == "Rejected"]

        return create_response(
            status=200,
            data={
                "documents": {
                    "Pending": serialize_list(pending),
                    "Approved": serialize_list(verified),
                    "Missing": serialize_list(missing),
                    "Rejected": serialize_list(rejected),
                }
            },
        )


# new put route only for uploading documents
# was previously in post when we shouldn't really be creating a new document in the database
@document.route("/document/<id>", methods=["PUT"])
def upload_document(id):
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for new Document")

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)

    doc = Document.query.get(id)

    if "fileName" in data and request.files is not None and file in request.files:
        fileName = data.get("fileName")
        file = request.files.get("file")
        file_info = upload_file(file, fileName)
        doc.fileID = file_info["file"].id
        doc.link = file_info["link"]
        doc.fileName = fileName

    if "status" in data:
        doc.status = data.get("status")

    ret_dict = doc.to_dict

    db.session.commit()

    return create_response(status=200, data={document: ret_dict})


@document.route("/document", methods=["POST"])
def create_new_documents():
    """
    used upon assignment of documents to field partner
    """
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for new Document")

    token = request.headers.get("token")
    headers = {"Content-type": "application/json", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)

    if info == "fp":
        return create_response(
            status=400, message="You do not have permission to delete documents!"
        )
    if "userID" not in data:
        return create_response(
            status=400, message="No UserID provided for new Document"
        )

    if "docClassIDs" not in data:
        return create_response(status=400, message="No document classes provided")

    if "dueDate" not in data:
        return create_response(status=400, message="No due date provided")

    userID = data.get("userID")

    status = "Missing"

    date = data.get("dueDate")

    document_class_ids = data.get("docClassIDs").split(",")

    for document_class_id in document_class_ids:
        data = {
            "userID": userID,
            "status": status,
            "docClassID": document_class_id,
            "date": date,
        }
        new_doc = Document(data)
        db.session.add(new_doc)

    fp = FieldPartner.query.get(userID)
    fp.app_status = "In Process"

    db.session.commit()
    return create_response(status=200, message="success")


@document.route("/document/<id>", methods=["DELETE"])
def delete_document(id):
    """
    Deletes all documents related to a document class in database
    """

    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)

    if info == "fp":
        return create_response(
            status=400, message="You do not have permission to delete documents!"
        )

    # gets all document <id> native to db and sees if == to docClassID. Then deletes
    Document.query.filter((Document.id == str(id))).delete()

    db.session.commit()
    return create_response(status=200, message="success")


@document.route("/document/delete_by_fp/<id>", methods=["DELETE"])
def delete_documents_by_fp(id):
    """
    Deletes all documents belonging to the specified user
    """

    Document.query.filter((Document.userID == str(id))).delete()

    db.session.commit()
    return create_response(status=200, message="success")
