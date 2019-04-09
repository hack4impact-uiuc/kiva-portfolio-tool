from api.models import db, Document, DocumentClass
from datetime import date
import enum


class MyEnum(enum.Enum):
    one = 1
    two = 2
    three = 3


# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def add_mock_docclass():
    temp_docclass = DocumentClass(
        name="DocClass",
        description="Description"
    )

    temp_docclass = get_mock_docclass()
    db.session.add(temp_docclass)
    db.session.commit()
    return temp_docclass.id


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_document(client):
    rs = client.get("/document")
    assert rs.status_code == 403
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    # Adding a docclass to the database
    docclass_id = add_mock_docclass()

    # create Person and test whether it returns a person
    temp_document = Document(
        fileID="DunDunDun",
        userID="WompWomp",
        date=date.fromordinal(730920),
        status="Pending",
        docClassID=docclass_id,
        fileName="MyDoc.docx",
        latest=True,
        description="Yeet",
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
    assert rs.status_code == 403

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


def test_post_document(client):
    rs = client.post("/document/new")
    assert rs.status_code == 500
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    # Adding a docclass to the database
    docclass_id = add_mock_docclass()

    rs = client.post(
        "/document/new",
        content_type="application/json",
        json={"userID": 7, "status": "Missing", "docClassID": docclass_id },
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    rs = client.post(
        "/document/new",
        content_type="application/json",
        json={"status": "Missing", "docClassID": docclass_id},
    )
    assert rs.status_code == 422
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False


def test_delete_document(client):
    # Adding a docclass to the database
    docclass_id = add_mock_docclass()

    rs = client.post(
        "/document/new",
        content_type="application/json",
        json={"userID": 8, "status": "Missing", "docClassID": docclass_id},
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    rs = client.delete("/document/delete/PostDocumentestFile")
    assert rs.status_code == 500
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    rs = client.delete("/document/delete/Post%20Document%20Test%20File")
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True


def test_put_document(client):
    # Adding a docclass to the database
    docclass_id = add_mock_docclass()

    rs = client.post(
        "/document/new",
        content_type="application/json",
        json={"userID": 9, "status": "Missing", "docClassID": docclass_id},
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    rs = client.put(
        "/document/update/Postadfa",
        content_type="application/json",
        json={
            "status": "Pending",
            "docClassID": docclass_id,
            "description": "Super Duper LMAO",
        },
    )
    assert rs.status_code == 500
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    rs = client.put(
        "/document/update/Test%20File",
        content_type="application/json",
        json={
            "status": "Pending",
            "docClassID": docclass_id,
            "description": "Super Duper LMAO",
        },
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    rs = client.get("/document?description=LMAO")
    ret_dict = rs.json
    # logger.info(ret_dict)
    assert (
        ret_dict["result"]["documents"]["Pending"][0]["docClassID"]
        == docclass_id
    )
    assert ret_dict["result"]["documents"]["Pending"][0]["status"] == "Pending"


def test_update_status(client):
    # Adding a docclass to the database
    docclass_id = add_mock_docclass()

    temp_document = Document(
        fileID="Navam",
        userID="Why",
        date=date.fromordinal(730920),
        status="Pending",
        docClassID=docclass_id,
        fileName="MyDoc.docx",
        latest=True,
        description="Yeet",
    )
    db.session.add(temp_document)
    db.session.commit()

    url = "/document/update/" + str(temp_document.id) + "/Missing"
    rs = client.put(url)
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]) == 1
    assert ret_dict["result"]["document"]["fileID"] == "Navam"
    assert ret_dict["result"]["document"]["userID"] == "Why"
    assert ret_dict["result"]["document"]["status"] == "Missing"
