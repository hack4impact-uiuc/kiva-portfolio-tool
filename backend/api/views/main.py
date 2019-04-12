from flask import Blueprint, request, json
from api.models import Document, Message, db, DocumentClass
from api.views.box import upload_file
from api.core import create_response, serialize_list, logger

main = Blueprint("main", __name__)  # initialize blueprint


# function that is called when you visit /
@main.route("/")
def index():
    # you are now in the current application context with the main.route decorator
    # access the logger with the logger from api.core and uses the standard logging module
    # try using ipdb here :) you can inject yourself
    logger.info("Hello World!")
    return "<h1>Hello World!</h1>"


"""
Template for different endpoints -> both GET and POST
To write these, make sure to create a new .py. Add a new blueprint to the file and the __init__.py

# Getting all the information in the specified data table
# To specify specific data you want to call from the class you specified, call methods accordingly and input parameter: data = {}, status = 200, message="ex: success"
@main.route("/<yourclassname>", methods=["GET"])
def get_<yourclassname>():
    sample_var = <yourclassname>.query.all()
    return create_response(data={"<yourclassname>": serialize_list(messages)})

@main.route("/<yourclassname>", methods=["POST"])
def add_<yourclassname>():
    sample_args = request.args
    new_data = dataclassname(sample_args ...)
    return create_response(status=200, message="success")
"""


@main.route("/document", methods=["GET"])
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

        # if no documents found, let user know
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="No Documents Found")

        # Adds a field called docClassName to each document
        for document in docs:
            document.docClassName = DocumentClass.query.get(document.docClassID).name

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
        docs = Document.query.filter_by(**kwargs)

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

        # if no documents found, let user know
        if len(serialize_list(docs)) == 0:
            return create_response(status=403, message="No Documents Found")

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


@main.route("/document/new", methods=["POST"])
def create_new_document():
    """
    functionality used to add a new document to database
    """
    # data for new document should be stored as json in request
    data = request.form

    # Each document requires a mandatory userID, status (By Default Missing), and a Document Class
    if "userID" not in data:
        return create_response(
            status=422, message="No UserID provided for new Document"
        )
    if "status" not in data:
        return create_response(
            status=422, message="No Status provided for new Document"
        )
    if "docClassID" not in data:
        return create_response(
            status=422, message="No Document Class provided for new Document"
        )
    # requeest.args[0] == file byte
    # request.args[1] == other args necessary for doc creation
    # sample_args = request.args[1]
    # Turns data into a Document and adds it to database
    # print(request)
    # print(data)
    file_info = upload_file(request.files.get("file"), data["fileName"])

    print(data)
    new_data = Document(data)

    # print("check after")
    new_data.fileID = file_info.id
    # use retrieved file_info

    db.session.add(new_data)
    db.session.commit()
    return create_response(status=200, message="success")

@main.route("/search/documents", methods=["GET"])
def retrieve_file_id():
    params = config()
    conn = psycopg2.connect(**params)
    cur = conn.cursor()

@main.route("/document/delete/<docClassID>", methods=["DELETE"])
def delete_document(docClassID):
    """
    Deletes all documents related to a document class in database
    """
    # logger.info(docClassID)
    db.session.delete(
        # gets all document <id> native to db and sees if == to docClassID. Then deletes
        Document.query.filter((Document.docClassID == str(docClassID))).first()
    )
    db.session.commit()
    return create_response(status=200, message="success")


@main.route("/document/update/<docClassID>", methods=["PUT"])
def update_documents(docClassID):
    """
    functionality that updates a document/documentClass
    """

    # takes in updated docClassID information by json in request
    # receives all documents by docClassID
    doc = Document.query.filter((Document.docClassID == docClassID)).first()

    # for each item in a document:
    #   replace if updated item data provided
    #   else keep old value
    doc.fileID = request.json.get("fileID", doc.fileID)
    doc.date = request.json.get("date", doc.date)
    doc.status = request.json.get("status", doc.status)
    doc.docClassID = request.json.get("docClassID", doc.docClassID)
    doc.fileName = request.json.get("fileName", doc.fileName)
    doc.latest = request.json.get("latest", doc.latest)
    doc.description = request.json.get("description", doc.description)
    db.session.commit()
    return create_response(status=200, message="success")


@main.route("/document/update/<id>/<status>", methods=["PUT"])
def update_status(id, status):
    """ 
    function called when you visit /document/update/<id>/<status>. Updates a doc's status 
    """
    # get document by id
    doc = Document.query.get(id)
    # update doc status to new status and return
    doc.status = status
    ret = doc.to_dict()

    db.session.commit()
    return create_response(data={"document": ret})
