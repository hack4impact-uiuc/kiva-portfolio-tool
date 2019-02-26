from api.models import db, Message

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_message(client):
    rs = client.get("/messages")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["messages"] == []

    # create Person and test whether it returns a person
    temp_message = Message(
        pm_id="hey",
        fp_id="this is",
        to_fp=True,
        doc_id=123,
        status="sleepy",
        comment="hungry",
    )
    db.session.add(temp_message)
    db.session.commit()

    rs = client.get("/messages")
    ret_dict = rs.json
    assert len(ret_dict["result"]["messages"]) == 1
    assert ret_dict["result"]["messages"][0]["pm_id"] == "hey"
    assert ret_dict["result"]["messages"][0]["fp_id"] == "this is"
    assert ret_dict["result"]["messages"][0]["to_fp"] == True
    assert ret_dict["result"]["messages"][0]["doc_id"] == 123
    assert ret_dict["result"]["messages"][0]["status"] == "sleepy"
