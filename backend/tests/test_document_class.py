from api.models import db


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
    DocumentClass.query.delete()
    db.session.commit()

    rs = client.get("/document_class")
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert ret_dict["result"]["document"] == []

    # Creating a docclass and adding it to the database
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.get("/document_class")
    ret_dict = rs.json
    assert len(ret_dict["result"]["document"]) == 1
    assert ret_dict["result"]["document"][0]["name"] == "Annual Report"
    assert (
        ret_dict["result"]["document"][0]["description"] == "Annual report of finances"
    )


def test_get_document_class_by_id(client):
    DocumentClass.query.delete()

    # Creating a docclass and adding it to the database
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.get("/document_class/0")
    assert rs.status_code == 200
    ret_dict = rs.json
    assert ret_dict["success"] == True
    assert len(ret_dict["result"]["document"]) == 1
    assert ret_dict["result"]["document"][0]["name"] == "Annual Report"
    assert (
        ret_dict["result"]["document"][0]["description"] == "Annual report of finances"
    )


def test_add_document_class(client):
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
    assert ret_dict["result"]["name"] == "docname"
    assert ret_dict["result"]["description"] == "description here"


def test_update_document_class_by_id(client):
    # Creating a docclass and adding it to the database
    DocumentClass.query.delete()
    helper_docclass = create_docclass()
    db.session.add(helper_docclass)
    db.session.commit()

    rs = client.put(
        "/document_class/update/0",
        content_type="application/json",
        json={"name": "newdocname"},
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 4
    assert ret_dict["result"]["portfolio_manager"]["name"] == "newdocname"
    assert ret_dict["result"]["portfolio_manager"]["description"] == "description here"
