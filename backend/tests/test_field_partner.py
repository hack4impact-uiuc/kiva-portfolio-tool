from api.models import db, Person, Message

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_field_partner(client):
    rs = client.get("/field_partner")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["field_partner"] == []

    # create Field Partner and test whether it returns a field parnter
    temp_field_partner = FieldPartner(
        id="f1234",
        email="test@gmail.com",
        org_name="hack4impact"
        pm_id="p1234",
        app_status="Completed"
    )
    db.session.add()
    db.session.commit()

    rs = client.get("/field_partner")
    ret_dict = rs.json
    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["id"] == "f1234"
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"][0]["pm_id"] == "p1234"
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"
