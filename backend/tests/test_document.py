from api.models import db, Document, DocumentClass
from datetime import date
import enum, requests, json, random, string

BACKEND_URL = "http://localhost:8000/"


class MyEnum(enum.Enum):
    one = 1
    two = 2
    three = 3


r = (
    requests.post(
        BACKEND_URL + "register",
        data={
            "email": "test@gmail.com",
            "password": "test",
            "securityQuestionAnswer": "answer",
            "answer": "yo",
            "questionIdx": 1,
            "role": "pm",
        },
    )
).json()

if r.get("status") == 400:
    r = (
        requests.post(
            BACKEND_URL + "login", data={"email": "test@gmail.com", "password": "test"}
        )
    ).json()

token = r.get("token")

headers = {"Content-type": "application/x-www-form-urlencoded", "token": token}

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def add_mock_docclass(className):
    temp_docclass = DocumentClass({"name": className, "description": "Description"})

    db.session.add(temp_docclass)
    db.session.commit()
    return temp_docclass.id


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_document(client):
    rs = client.get("/document")
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    # Adding a docclass to the database
    docclass_id = add_mock_docclass("test_get_document")

    # create Person and test whether it returns a person
    temp_document = Document(
        {
            "fileID": "DunDunDun",
            "userID": "WompWomp",
            "date": date.fromordinal(730920),
            "status": "Pending",
            "docClassID": docclass_id,
            "fileName": "MyDoc.docx",
            "latest": True,
            "description": "Yeet",
        }
    )
    db.session.add(temp_document)
    db.session.commit()

    rs = client.get("/document")
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Pending"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Pending"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Pending"][0]["status"] == "Pending"

    rs = client.get("/document?fid=jalkdf")
    assert rs.status_code == 200

    rs = client.get("/document?description=Ye")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Pending"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Pending"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Pending"][0]["status"] == "Pending"

    rs = client.get("/document?uid=WompWomp")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Pending"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Pending"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Pending"][0]["status"] == "Pending"


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT
def test_update_status(client):
    # Adding a docclass to the database
    docclass_id = add_mock_docclass("test_update_status")

    temp_document = Document(
        {
            "fileID": "Navam",
            "userID": "Why",
            "date": date.fromordinal(730920),
            "status": "Pending",
            "docClassID": docclass_id,
            "fileName": "MyDoc.docx",
            "latest": True,
            "description": "Yeet",
        }
    )
    db.session.add(temp_document)
    db.session.commit()

    rs = client.put(
        "/document/status/" + str(temp_document.id),
        content_type="multipart/form-data",
        data={"status": "Missing"},
        headers=headers,
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]) == 1
    assert ret_dict["result"]["document"]["fileID"] == "Navam"
    assert ret_dict["result"]["document"]["userID"] == "Why"
    assert ret_dict["result"]["document"]["status"] == "Missing"


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT

# test functionality of adding new Documents
# files ignored for the time being for simplicity's sake
def test_create_new_document(client):
    docclass_id = add_mock_docclass("test_create_new_document")

    # attempt POST with each parameter missing

    # docClassID missing
    rs = client.post(
        "document/new",
        content_type="multipart/form-data",
        data={"userID": 1, "status": "Pending"},
        headers=headers,
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["message"] == "No Document Class provided for new Document"

    # status missing
    rs = client.post(
        "document/new",
        content_type="multipart/form-data",
        data={"userID": 1, "docClassID": docclass_id},
        headers=headers,
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["message"] == "No Status provided for new Document"

    # userID missing
    rs = client.post(
        "document/new",
        content_type="multipart/form-data",
        data={"docClassID": docclass_id, "status": "Pending"},
        headers=headers,
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["message"] == "No UserID provided for new Document"

    # valid POST
    rs = client.post(
        "document/new",
        content_type="multipart/form-data",
        data={"userID": 1, "status": "Pending", "docClassID": docclass_id},
        headers=headers,
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
