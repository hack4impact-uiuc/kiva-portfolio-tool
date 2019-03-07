from api.models import db, FieldPartner, PortfolioManager

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200

def create_pm():
    # create a Portfolio Manager for testing
    helper_arr_fps = []
    helper_arr_fps.append("f123")
    helper_arr_fps.append("f234")
    helper_arr_fps.append("f345")
    helper_portfolio_manager = PortfolioManager(
        email="hello", name="Tim", list_of_fps=helper_arr_fps
    )

    return helper_portfolio_manager

def create_fp(helper_portfolio_manager):
     # create Field Partner and test whether it returns a field parnter
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
    assert ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"

def test_get_fp_by_id(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    print(temp_field_partner)
    print(temp_field_partner.id)
    url = "/field_partner/get/id/" + temp_field_partner.id
    print(url)
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    print(ret_dict)

    assert len(ret_dict["result"]["field_partner"]) == 5
    assert ret_dict["result"]["field_partner"]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"]["app_status"] == "Completed"

def test_get_fp_by_email(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/get/email/" + temp_field_partner.email
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"

def test_get_fp_by_pm(client):
    helper_portfolio_manager = create_pm()
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    temp_field_partner = create_fp(helper_portfolio_manager)
    db.session.add(temp_field_partner)
    db.session.commit()

    url = "/field_partner/get/pm/" + helper_portfolio_manager.id
    rs = client.get(url)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True

    assert len(ret_dict["result"]["field_partner"]) == 1
    assert ret_dict["result"]["field_partner"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["field_partner"][0]["org_name"] == "hack4impact"
    assert ret_dict["result"]["field_partner"][0]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["field_partner"][0]["app_status"] == "Completed"