from api.models import db, PortfolioManager, FieldPartner

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client
def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200

def test_get_portfolio_manager(client):
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()

    rs = client.get("/portfolio_manager")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["portfolio_manager"] == []

    # create Portfolio Manager it returns a portfolio manager
    temp_arr_fps = []
    temp_arr_fps.append("f123")
    temp_arr_fps.append("f234")
    temp_arr_fps.append("f345")
    temp_portfolio_manager = PortfolioManager(
        email="test@gmail.com",
        name="Tim",
        list_of_fps=temp_arr_fps,
    )
    db.session.add(temp_portfolio_manager)
    db.session.commit()

    rs = client.get("/portfolio_manager")
    ret_dict = rs.json
    assert len(ret_dict["result"]["portfolio_manager"]) == 1
    # assert ret_dict["result"]["portfolio_manager"][0]["id"] == "p1234"
    assert ret_dict["result"]["portfolio_manager"][0]["email"] == "test@gmail.com"
    assert ret_dict["result"]["portfolio_manager"][0]["name"] == "Tim"
    assert ret_dict["result"]["portfolio_manager"][0]["list_of_fps"] == temp_arr_fps