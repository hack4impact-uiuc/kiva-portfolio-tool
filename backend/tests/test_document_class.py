from api.models import db, DocumentClass, Document


# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def create_docclass():
    temp_docclass = DocumentClass(
        name="Annual Report", description="Annual report of finances"
    )
    return temp_docclass


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_document_class(client):
    Document.query.delete()
    DocumentClass.query.delete()
    db.session.commit()

    rs = client.get("/document_class")
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert ret_dict["result"]["document_class"] == []

    # Creating a docclass and adding it to the database
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.get("/document_class")
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
        "/document_class/new",
        content_type="application/json",
        json={"description": "description here"},
    )
    assert rs.status_code == 422
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
    assert ret_dict["message"] == "No name provided for new Document Class"

    # Test for legal add
    rs = client.post(
        "/document_class/new",
        content_type="application/json",
        json={"name": "docname", "description": "description here"},
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
        "/document_class/update/" + helper_docclass.id,
        content_type="application/json",
        json={"name": "newdocname"},
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert ret_dict["result"]["document_class"]["name"] == "newdocname"
    assert (
        ret_dict["result"]["document_class"]["description"]
        == "Annual report of finances"
    )
