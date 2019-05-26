from flask import Blueprint, request, json
from api.models import Document, Message, db, DocumentClass, FieldPartner
from api.views.box import upload_file
from api.core import create_response, serialize_list, logger

document = Blueprint("document", __name__)


@document.route("/documents", methods=["GET"])
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
<<<<<<< HEAD
    kwargs["latest"] = request.args.get("latest")

    # stores time for parse searching
    description = request.args.get("description")
=======
>>>>>>> master

    # refines kwargs to remove all the None values and only search by values provided
    kwargs = {k: v for k, v in kwargs.items() if v is not None}

    # if no search parameters provided return all documents
    if len(kwargs) == 0:
        docs = Document.query.all()
<<<<<<< HEAD

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

        # Adds a field called docClassName to each document
        for doc in docs:
            doc.docClass = DocumentClass.query.get(doc.docClassID).to_dict()

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
=======
>>>>>>> master
    # if there are query arguments the following occurs
    else:
        # Unpacks the search values in our dictionary and provides them to Flask/SQLalchemy
        docs = Document.query.filter_by(**kwargs).all()

<<<<<<< HEAD
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

        for doc in docs:
            doc.docClass = DocumentClass.query.get(doc.docClassID).to_dict()

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
@document.route("/document/upload/<id>", methods=["PUT"])
def upload_document(id):
=======
    # adds the corresponding document class to each document
    for doc in docs:
        doc.docClass = DocumentClass.query.get(doc.docClassID).to_dict()

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


@document.route("/document/<id>", methods=["PUT"])
def update_document(id):
>>>>>>> master
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for new Document")

<<<<<<< HEAD
    if "fileName" not in data:
        return create_response(status=400, message="No file name provided")

    fileName = data.get("fileName")

    if request.files is None or "file" not in request.files:
        return create_response(status=400, message="No file provided")

    file = request.files.get("file")

    file_info = upload_file(file, fileName)
=======
    token = request.headers.get("token")
    headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

    message, info = verify_token(token)
    if message != None:
        return create_response(status=400, message=message)
>>>>>>> master

    doc = Document.query.get(id)

    if "fileName" in data and request.files is not None and file in request.files:
        fileName = data.get("fileName")
        file = request.files.get("file")
        file_info = upload_file(file, fileName)
        doc.fileID = file_info["file"].id
        doc.link = file_info["link"]
        doc.fileName = fileName

<<<<<<< HEAD
    if data is None:
        return create_response(status=400, message="No body provided for new Document")
    # Each document requires a mandatory userID, status (By Default Missing), and a Document Class
    if "userID" not in data:
        return create_response(
            status=400, message="No UserID provided for new Document"
        )
    if "status" not in data:
        return create_response(
            status=400, message="No Status provided for new Document"
        )
    if "docClassID" not in data:
        return create_response(
            status=400, message="No Document Class provided for new Document"
        )
=======
    if "status" in data:
        doc.status = data.get("status")
>>>>>>> master

    db.session.commit()

    return create_response(status=200, message="success")


@document.route("/documents", methods=["POST"])
def create_new_documents():
    """
    used upon assignment of documents to field partner
    """
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for new Document")

    if "userID" not in data:
        return create_response(
            status=400, message="No UserID provided for new Document"
        )

    if "docClassIDs" not in data:
        return create_response(status=400, message="No document classes provided")

    userID = data.get("userID")

    status = "Missing"

    document_class_ids = data.get("docClassIDs").split(",")
    document_ids = []

    if type(document_class_ids) != list:
        document_class_ids = document_class_ids.split(",")

    for document_class_id in document_class_ids:
        data = {"userID": userID, "status": status, "docClassID": document_class_id}
        new_doc = Document(data)
        doc_dict = new_doc.to_dict()
        document_ids.append(doc_dict["_id"])
        db.session.add(new_doc)

    fp = FieldPartner.query.get(userID)
    fp.app_status = "In Process"

    ret = {"docIDs": document_ids}

    db.session.commit()

    # Make it return the document ids
    return create_response(status=200, data=ret)


<<<<<<< HEAD
@document.route("/document/delete/<docClassID>", methods=["DELETE"])
def delete_document(docClassID):
=======
@document.route("/document/<id>", methods=["DELETE"])
def delete_document(id):
>>>>>>> master
    """
    Deletes all documents related to a document class in database
    """

<<<<<<< HEAD
    db.session.delete(
        # gets all document <id> native to db and sees if == to docClassID. Then deletes
        Document.query.filter((Document.docClassID == str(docClassID))).first()
    )
    db.session.commit()
    return create_response(status=200, message="success")


@document.route("/document/update/<docClassID>", methods=["PUT"])
def update_documents(docClassID):
    """
    functionality that updates a document/documentClass
    """
    data = request.form

    if data is None:
        return create_response(status=200, message="No data provided")

    # takes in updated docClassID information by json in request
    # receives all documents by docClassID
    doc = Document.query.filter((Document.docClassID == docClassID)).first()

    # for each item in a document:
    #   replace if updated item data provided
    #   else keep old value
    doc.fileID = data.get("fileID", doc.fileID)
    doc.status = data.get("status", doc.status)
    doc.docClassID = data.get("docClassID", doc.docClassID)
    doc.fileName = data.get("fileName", doc.fileName)
    doc.latest = data.get("latest", doc.latest)
    doc.description = data.get("description", doc.description)
    db.session.commit()
    return create_response(status=200, message="success")


# given id of document, can update its status to new status provided in url
@document.route("/document/status/<id>", methods=["PUT"])
def update_status(id):
    """ 
    function called when you visit /document/update/<id>/<status>. Updates a doc's status 
    """

    # why does get_json() work sometimes and form does other times?
    # this tries both to be safe
    data = request.form
    if data is None:
        return create_response(status=400, message="No data provided")

    if "status" not in data:
        return create_response(status=400, message="No document status provided")

    status = data.get("status")

    # get document by id
    doc = Document.query.get(id)
    # update doc status to new status and return
    doc.status = status
    ret = doc.to_dict()

    db.session.commit()
    return create_response(data={"document": ret})
=======
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
>>>>>>> master
