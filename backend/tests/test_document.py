from api.models import db, Document
from datetime import date
import enum


class MyEnum(enum.Enum):
    one = 1
    two = 2
    three = 3


# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_document(client):
    rs = client.get("/document")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["documents"] == {
        "Missing": [],
        "Pending": [],
        "Rejected": [],
        "Verified": [],
    }

    # create Person and test whether it returns a person
    temp_document = Document(
        fileID="DunDunDun",
        userID="WompWomp",
        date=date.fromordinal(730920),
        status="Missing",
        docType="MyEnum.one",
        docName="MyDoc.docx",
        latest=True,
        description="Yeet",
    )
    db.session.add(temp_document)
    db.session.commit()

    rs = client.get("/document")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Missing"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Missing"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Missing"][0]["status"] == "Missing"

    rs = client.get("/document?description=Ye")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Missing"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Missing"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Missing"][0]["status"] == "Missing"

    rs = client.get("/document?uid=WompWomp")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    assert ret_dict["result"]["documents"]["Missing"][0]["fileID"] == "DunDunDun"
    assert ret_dict["result"]["documents"]["Missing"][0]["userID"] == "WompWomp"
    assert ret_dict["result"]["documents"]["Missing"][0]["status"] == "Missing"

    rs = client.get("/document?fid=jalkdf")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 4
    for i in ret_dict["result"]["documents"]:
        assert len(ret_dict["result"]["documents"][i]) == 0
