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
        email="hello", name="Tim", list_of_fps=helper_arr_fps
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
    assert ret_dict["result"]["portfolio_manager"][0]["list_of_fps"] == helper_portfolio_manager.list_of_fps


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

    assert len(ret_dict["result"]["portfolio_manager"]) == 4
    assert ret_dict["result"]["portfolio_manager"]["email"] == "hello"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "Tim"
    assert ret_dict["result"]["portfolio_manager"]["list_of_fps"] == helper_portfolio_manager.list_of_fps


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
    assert ret_dict["result"]["portfolio_manager"][0]["list_of_fps"] == helper_portfolio_manager.list_of_fps

def test_get_all_fps(client):
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    url = "/portfolio_manager/all_fps/" + helper_portfolio_manager.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["list_of_fps"]) == 3
    assert ret_dict["result"]["list_of_fps"][0] == helper_portfolio_manager.list_of_fps[0]
    assert ret_dict["result"]["list_of_fps"][2] == helper_portfolio_manager.list_of_fps[2]

def test_new_pm(client):
    rs = client.post("/portfolio_manager/new")
    assert rs.status_code == 500
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    helper_arr_fps = []
    helper_arr_fps.append("f000")
    helper_arr_fps.append("f111")
    helper_arr_fps.append("f222")

    rs = client.post(
        "/portfolio_manager/new",
        content_type="application/json",
        json={
            "email": "angad",
            "name": "royuwu",
            "list_of_fps": helper_arr_fps
        },
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["portfolio_manager"]) == 4
    assert ret_dict["result"]["portfolio_manager"]["email"] == "angad"
    assert ret_dict["result"]["portfolio_manager"]["name"] == "royuwu"
    assert ret_dict["result"]["portfolio_manager"]["list_of_fps"] == helper_arr_fps

    # Tests for if not all fields are provided
    rs = client.post(
        "/portfolio_manager/new",
        content_type="application/json",
        json={"email": "angad", "name": "royuwu"},
    )
    assert rs.status_code == 422
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
    assert ret_dict["message"] == "No list of FPs provided for new PM"

def test_add_fp(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = FieldPartner(
        email="test@gmail.com",
        org_name="hack4impact",
        pm_id=helper_portfolio_manager.id,
        app_status="Completed",
    )

    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/portfolio_manager/" + helper_portfolio_manager.id + "/" + temp_field_partner.id
    rs = client.put(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["list_of_fps"]) == 4
    assert ret_dict["result"]["list_of_fps"][3] == temp_field_partner.id