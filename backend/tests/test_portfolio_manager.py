from api.models import db, PortfolioManager, FieldPartner

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


def test_get_portfolio_manager(client):
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()

    rs = client.get("/portfolio_manager")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["portfolio_manager"] == []

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    rs = client.get("/portfolio_manager")
    ret_dict = rs.json
    assert len(ret_dict["result"]["portfolio_manager"]) == 1
    assert ret_dict["result"]["portfolio_manager"][0]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"][0]["name"] == "Tim"


def test_get_pm_by_id(client):
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    url = "/portfolio_manager/" + helper_portfolio_manager.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 3
    assert ret_dict["result"]["portfolio_manager"]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "Tim"


def test_get_pm_by_email(client):
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    url = "/portfolio_manager/email/" + helper_portfolio_manager.email
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 1
    assert ret_dict["result"]["portfolio_manager"][0]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"][0]["name"] == "Tim"


def test_new_pm(client):
    rs = client.post("/portfolio_manager/new")
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    rs = client.post(
        "/portfolio_manager/new",
        content_type="multipart/form-data",
        data={"email": "angad", "name": "royuwu"},
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 3
    assert ret_dict["result"]["portfolio_manager"]["email"] == "angad"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "royuwu"

    # Tests for if not all fields are provided
    rs = client.post(
        "/portfolio_manager/new",
        content_type="multipart/form-data",
        data={"email": "angad"},
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
