from api.models import db, Person, Document
from datetime import date
import enum
from sqlalchemy import Integer, Enum
import json

# class MyEnum(enum.Enum):
#     one = 'one'
#     two = 'two'
#     three = 'three'

# class EnumEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if type(obj) in MyEnum.values():
#             return {"__enum__": str(obj)}
#         return json.JSONEncoder.default(self, obj)

# def as_enum(d):
#     if "__enum__" in d:
#         name, member = d["__enum__"].split(".")
#         return getattr(MyEnum[name], member)
#     else:
#         return d
# ret_dict = json.dumps(rs, cls=EnumEncoder)


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

    # create Document and test whether it returns a Document
    temp_document = Document(
        fileID="DunDunDun",
        userID="WompWomp",
        date=date.fromordinal(730920),
        status="Pending",
        docClass="I-9's",
        fileName="MyDoc.docx",
        latest=True,
        description="Yeet",
    )
    db.session.add(temp_document)
    db.session.commit()

    rs = client.get("/documents")
    ret_dict = rs.json
    assert len(ret_dict["result"]["documents"]) == 1
    assert ret_dict["result"]["documents"][0]["fileID"] == "DunDunDun"
