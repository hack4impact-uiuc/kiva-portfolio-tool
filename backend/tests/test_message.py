from api.models import (
    db,
    Message,
    PortfolioManager,
    FieldPartner,
    DocumentClass,
    Document,
)
from datetime import date

# client passed from client - look into pytest for more info about fixtures
# test client api: http://flask.pocoo.org/docs/1.0/api/#test-client


def pytest_sessionfinish(session, exitstatus):
    """ whole test run finishes. """
    Message.query.delete()
    DocumentClass.query.delete()
    Document.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()


def create_pm(email, name):
    helper_portfolio_manager = PortfolioManager({"email": email, "name": name})
    return helper_portfolio_manager


def create_fp(email, org_name, helper_portfolio_manager, app_status):
    temp_field_partner = FieldPartner(
        {
            "email": email,
            "org_name": org_name,
            "pm_id": helper_portfolio_manager.id,
            "app_status": app_status,
        }
    )

    return temp_field_partner


def create_docclass(name):
    temp_docclass = DocumentClass(
        {"name": name, "description": "This is a description"}
    )
    return temp_docclass


def create_document(file_id, user_id, status, docclass):
    temp_document = Document(
        {
            "fileID": file_id,
            "userID": user_id,
            "date": date.fromordinal(730920),
            "status": status,
            "docClassID": docclass.id,
            "fileName": "MyDoc.docx",
            "latest": True,
            "description": "Yeet",
        }
    )
    return temp_document


def create_message(
    helper_portfolio_manager, helper_field_partner, to_fp, helper_doc, status
):
    temp_message = Message(
        {
            "pm_id": helper_portfolio_manager.id,
            "fp_id": helper_field_partner.id,
            "to_fp": to_fp,
            "doc_id": helper_doc.id,
            "status": status,
        }
    )
    return temp_message


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_messages(client):
    Message.query.delete()
    DocumentClass.query.delete()
    Document.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()

    rs = client.get("/messages")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["messages"] == []

    helper_portfolio_manager = create_pm("kelleyc2@illinois.edu", "Kelley")
    db.session.add(helper_portfolio_manager)
    db.session.commit()

    helper_field_partner = create_fp(
        "kchau490@gmail.com", "hack4impact", helper_portfolio_manager, "Complete"
    )
    db.session.add(helper_field_partner)
    db.session.commit()

    helper_docclass = create_docclass("ksdljf")
    db.session.add(helper_docclass)
    db.session.commit()

    helper_doc = create_document(
        "kjdslfjdskl", "jsdlkfjdskf", "Pending", helper_docclass
    )
    db.session.add(helper_doc)
    db.session.commit()

    temp_message = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        True,
        helper_doc,
        helper_doc.status,
    )
    # TODO: just use the given document's status instead of passing it to the message?
    db.session.add(temp_message)
    db.session.commit()

    rs = client.get("/messages")
    ret_dict = rs.json

    assert len(ret_dict["result"]["messages"]) == 1
    assert ret_dict["result"]["messages"][0]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["messages"][0]["fp_id"] == helper_field_partner.id
    assert ret_dict["result"]["messages"][0]["doc_id"] == helper_doc.id
    assert ret_dict["result"]["messages"][0]["status"] == "Pending"
