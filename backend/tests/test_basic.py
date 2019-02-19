from api.models import db, Person, Document

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_person(client):
    rs = client.get("/persons")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["persons"] == []

    # create Person and test whether it returns a person
    temp_person = Person(name="Tim")
    db.session.add(temp_person)
    db.session.commit()

    rs = client.get("/persons")
    ret_dict = rs.json
    assert len(ret_dict["result"]["persons"]) == 1
    assert ret_dict["result"]["persons"][0]["name"] == "Tim"

def test_get_document(client):
    rs = client.get("/documents")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["documents"] == []

    # create Person and test whether it returns a person
    temp_document = Document(fileID='DunDunDun', userID="WompWomp", date=date.fromordinal(730920), status = MyEnum.two, docType=MyEnum.one, docName="MyDoc.docx", latest=True, description="Yeet")
    db.session.add(temp_document)
    db.session.commit()

    rs = client.get("/documents")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 1
    assert ret_dict["result"]["documents"][0]["fileID"] == "DunDunDun"
