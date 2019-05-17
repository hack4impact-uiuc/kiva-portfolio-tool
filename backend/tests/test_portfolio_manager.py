from api.models import db, PortfolioManager, FieldPartner, Message
import enum, requests, json, random, string

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
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


# create a Portfolio Manager for testing
def create_pm():
    helper_arr_fps = []
    helper_arr_fps.append("f123")
    helper_arr_fps.append("f234")
    helper_arr_fps.append("f345")
    helper_portfolio_manager = PortfolioManager(
        {"email": "hello", "name": "Tim", "list_of_fps": helper_arr_fps}
    )

    return helper_portfolio_manager


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT


def test_get_portfolio_manager(client):
    Message.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()

    rs = client.get("/portfolio_manager", headers=headers)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["portfolio_manager"] == []

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    rs = client.get("/portfolio_manager", headers=headers)
    ret_dict = rs.json
    assert len(ret_dict["result"]["portfolio_manager"]) == 1
    assert ret_dict["result"]["portfolio_manager"][0]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"][0]["name"] == "Tim"


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT


def test_get_pm_by_id(client):
    Message.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    url = "/portfolio_manager/" + helper_portfolio_manager.id
    rs = client.get(url, headers=headers)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 3
    assert ret_dict["result"]["portfolio_manager"]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "Tim"


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT


def test_get_pm_by_email(client):
    Message.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    url = "/portfolio_manager?email=" + helper_portfolio_manager.email
    rs = client.get(url, headers=headers)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 1
    assert ret_dict["result"]["portfolio_manager"][0]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"][0]["name"] == "Tim"


# ADD BACK IN ONCE AUTH TOKEN TESTING IS FIGURED OUT


def test_new_pm(client):
    rs = client.post("/portfolio_manager")
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    rs = client.post(
        "/portfolio_manager",
        content_type="multipart/form-data",
        data={"email": "angad", "name": "royuwu"},
        headers=headers,
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 3
    assert ret_dict["result"]["portfolio_manager"]["email"] == "angad"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "royuwu"

    # Tests for if not all fields are provided
    rs = client.post(
        "/portfolio_manager",
        content_type="multipart/form-data",
        data={"email": "angad"},
        headers=headers,
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
