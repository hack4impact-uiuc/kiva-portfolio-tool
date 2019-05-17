from api.models import db, DocumentClass, Document

import requests

BACKEND_URL = "http://localhost:8000/"

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
def create_docclass():
    temp_docclass = DocumentClass(
        {"name": "Annual Report", "description": "Annual report of finances"}
    )
    return temp_docclass


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_document_class(client):
    Document.query.delete()
    DocumentClass.query.delete()
    db.session.commit()

    rs = client.get("/document_classes")
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert ret_dict["result"]["document_class"] == []

    # Creating a docclass and adding it to the database
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.get("/document_classes")
    ret_dict = rs.json
    assert len(ret_dict["result"]["document_class"]) == 1
    assert ret_dict["result"]["document_class"][0]["name"] == "Annual Report"
    assert (
        ret_dict["result"]["document_class"][0]["description"]
        == "Annual report of finances"
    )


def test_get_document_class_by_id(client):
    Document.query.delete()
    DocumentClass.query.delete()

    # Creating a docclass and adding it to the database
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.get("/document_class/" + helper_docclass.id)
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert ret_dict["result"]["document_class"]["_id"] == helper_docclass.id
    assert ret_dict["result"]["document_class"]["name"] == "Annual Report"
    assert (
        ret_dict["result"]["document_class"]["description"]
        == "Annual report of finances"
    )


def test_add_document_class(client):
    Document.query.delete()
    DocumentClass.query.delete()
    db.session.commit()

    # Test for not having required field provided
    rs = client.post(
        "/document_classes",
        content_type="multipart/form-data",
        data={"description": "description here"},
        headers=headers,
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
    assert ret_dict["message"] == "No name provided for new Document Class"

    # Test for legal add
    rs = client.post(
        "/document_classes",
        content_type="multipart/form-data",
        data={"name": "docname", "description": "description here"},
        headers=headers,
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["message"] == "success"


def test_update_document_class_by_id(client):
    # Creating a docclass and adding it to the database
    Document.query.delete()
    DocumentClass.query.delete()
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.put(
        "/document_class/" + helper_docclass.id,
        content_type="multipart/form-data",
        data={"name": "newdocname"},
        headers=headers,
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert ret_dict["result"]["document_class"]["name"] == "newdocname"
    assert (
        ret_dict["result"]["document_class"]["description"]
        == "Annual report of finances"
    )
