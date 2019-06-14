from api.models import db, FieldPartner, PortfolioManager
import time, uuid

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


# create a Portfolio Manager for testing
def create_pm():
    helper_portfolio_manager = PortfolioManager({"email": "hello", "name": "Tim"})

    return helper_portfolio_manager


# create Field Partner and test whether it returns a field parnter
def create_fp(helper_portfolio_manager):
    temp_field_partner = FieldPartner(
        {
            "email": "test@gmail.com",
            "org_name": "hack4impact",
            "pm_id": helper_portfolio_manager.id,
            "app_status": "Complete",
            "due_date": 1559354885971,
        }
    )

    return temp_field_partner


def test_get_field_partner(client):
    rs = client.get("/field_partners")

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

    rs = client.get("/field_partners")
    ret_dict = rs.json

    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Complete"
    assert ret_dict["result"]["field_partner"][0]["due_date"] == 1559354885971


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

    assert len(ret_dict["result"]["field_partner"]) == 8
    assert ret_dict["result"]["field_partner"]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"]["app_status"] == "Complete"
    assert ret_dict["result"]["field_partner"]["due_date"] == 1559354885971


def test_get_fp_by_org_name(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partners?org_name=" + temp_field_partner.org_name
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]) == 1
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"


def test_get_fp_by_email(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partners?email=" + temp_field_partner.email
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Complete"
    assert ret_dict["result"]["field_partner"][0]["due_date"] == 1559354885971


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

    url = "/field_partners?pm_id=" + helper_portfolio_manager.id
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
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Complete"
    assert ret_dict["result"]["field_partner"][0]["due_date"] == 1559354885971

    assert ret_dict["result"]["field_partner"][1]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][1]["org_name"] == "hack4impact"
    assert (
        ret_dict["result"]["field_partner"][1]["pm_id"] == helper_portfolio_manager.id
    )
    assert ret_dict["result"]["field_partner"][1]["app_status"] == "Complete"
    assert ret_dict["result"]["field_partner"][1]["due_date"] == 1559354885971


def test_new_fp(client):
    db.session.query(FieldPartner).delete()
    db.session.query(PortfolioManager).delete()

    rs = client.post("/field_partners")
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False

    pm = create_pm()

    db.session.add(pm)
    db.session.commit()

    name = str(uuid.uuid4())

    rs = client.post(
        "/field_partners",
        content_type="multipart/form-data",
        data={
            "email": "santa",
            "org_name": name,
            "pm_id": pm.id,
            "app_status": "New Partner",
            "due_date": 1559354885979,
        },
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 8
    assert ret_dict["result"]["field_partner"]["email"] == "santa"
    assert ret_dict["result"]["field_partner"]["org_name"] == name
    assert ret_dict["result"]["field_partner"]["pm_id"] == pm.id
    assert ret_dict["result"]["field_partner"]["app_status"] == "New Partner"
    assert ret_dict["result"]["field_partner"]["due_date"] == 1559354885979

    # Tests for if not all fields are provided
    rs = client.post(
        "/field_partners",
        content_type="multipart/form-data",
        data={"email": "santa", "org_name": "Kiva"},
    )
    assert rs.status_code == 400
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == False
    assert ret_dict["message"] == "No PM ID provided for new FP"


def test_fp_update_app_status(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/" + temp_field_partner.id

    rs = client.put(
        url, content_type="multipart/form-data", data={"app_status": "In Process"}
    )
    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 8
    assert ret_dict["result"]["field_partner"]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"]["app_status"] == "In Process"
