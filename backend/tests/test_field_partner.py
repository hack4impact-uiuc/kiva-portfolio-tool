from api.models import db, FieldPartner, PortfolioManager

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


# create Field Partner and test whether it returns a field parnter
def create_fp(helper_portfolio_manager):
    temp_field_partner = FieldPartner(
        email="test@gmail.com",
        org_name="hack4impact",
        pm_id=helper_portfolio_manager.id,
        app_status="Completed",
    )

    return temp_field_partner


def test_get_field_partner(client):
    rs = client.get("/field_partner")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["field_partner"] == []

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    rs = client.get("/field_partner")
    ret_dict = rs.json
    # fp_obj = FieldPartner.query.get("f1234")
    # print(type(fp_obj))

    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"


def test_get_fp_by_id(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/" + temp_field_partner.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 5
    assert ret_dict["result"]["field_partner"]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"]["app_status"] == "Completed"


def test_get_org_by_id(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/org_name/" + temp_field_partner.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]) == 1
    assert ret_dict["result"]["org_name"] == "hack4impact"


def test_get_fp_by_email(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/email/" + temp_field_partner.email
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    print("FP BY EMAIL: " + str(ret_dict["result"]))
    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"


def test_get_fp_by_pm(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    temp_field_partner1 = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner1)
    db.session.commit()

    url = "/field_partner/pm/" + helper_portfolio_manager.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 2
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"

    assert ret_dict["result"]["field_partner"][1]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][1]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][1]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][1]["app_status"] == "Completed"


def test_new_fp(client):
    rs = client.post("/field_partner/new")
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    rs = client.post(
        "/field_partner/new",
        content_type="application/json",
        json={
            "email": "santa",
            "org_name": "Kiva",
            "pm_id": "2",
            "app_status": "Not started",
        },
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 5
    assert ret_dict["result"]["field_partner"]["email"] == "santa"
    assert ret_dict["result"]["field_partner"]["org_name"] == "Kiva"
    assert ret_dict["result"]["field_partner"]["pm_id"] == "2"
    assert ret_dict["result"]["field_partner"]["app_status"] == "Not started"

    # Tests for if not all fields are provided
    rs = client.post(
        "/field_partner/new",
        content_type="application/json",
        json={"email": "santa", "org_name": "Kiva"},
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
    assert ret_dict["message"] == "No PM ID provided for new FP"


def test_update_app_status(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/update/" + temp_field_partner.id

    rs = client.put(
        url, content_type="application/json", json={"app_status": "Updated"}
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 5
    assert ret_dict["result"]["field_partner"]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"]["app_status"] == "Updated"
