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


def create_pm(email, name):
    helper_portfolio_manager = PortfolioManager({"email": email, "name": name})
    db.session.add(helper_portfolio_manager)
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
    db.session.add(temp_field_partner)
    return temp_field_partner


def create_docclass(name):
    temp_docclass = DocumentClass(
        {"name": name, "description": "This is a description"}
    )
    db.session.add(temp_docclass)
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

    db.session.add(temp_document)
    return temp_document


def create_message(
    helper_portfolio_manager,
    helper_field_partner,
    to_fp,
    helper_doc,
    status,
    description,
):
    temp_message = Message(
        {
            "pm_id": helper_portfolio_manager.id,
            "fp_id": helper_field_partner.id,
            "to_fp": to_fp,
            "doc_id": helper_doc.id,
            "status": status,
            "description": description,
        }
    )

    db.session.add(temp_message)
    return temp_message


def cleanup():
    Message.query.delete()
    Document.query.delete()
    DocumentClass.query.delete()
    FieldPartner.query.delete()
    PortfolioManager.query.delete()
    db.session.commit()


def test_index(client):
    rs = client.get("/")
    assert rs.status_code == 200


def test_get_messages(client):
    rs = client.get("/messages")

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert ret_dict["success"] == True
    assert ret_dict["result"]["messages"] == []

    helper_portfolio_manager = create_pm("kelleyc2@illinois.edu", "Kelley")
    helper_docclass = create_docclass("ksdljf")
    db.session.commit()

    helper_field_partner = create_fp(
        "kchau490@gmail.com", "hack4impact", helper_portfolio_manager, "Complete"
    )
    helper_doc = create_document(
        "kjdslfjdskl", "jsdlkfjdskf", "Pending", helper_docclass
    )
    db.session.commit()

    temp_message = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        True,
        helper_doc,
        helper_doc.status,
        "Your Portfolio Manager has added a new required document: ksdljf",
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
    assert (
        ret_dict["result"]["messages"][0]["description"]
        == "Your Portfolio Manager has added a new required document: ksdljf"
    )

    cleanup()


def test_get_messages_by_fp(client):
    helper_portfolio_manager = create_pm("kelleyc2@illinois.edu", "Kelley")
    helper_docclass = create_docclass("ksdljf")
    db.session.commit()

    helper_field_partner = create_fp(
        "kchau490@gmail.com", "hack4impact", helper_portfolio_manager, "Complete"
    )
    helper_doc = create_document(
        "kjdslfjdskl", "jsdlkfjdskf", "Pending", helper_docclass
    )
    db.session.commit()

    temp_message = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        True,
        helper_doc,
        helper_doc.status,
        "Your document has been reviewed and has been Approved.",
    )
    db.session.add(temp_message)
    db.session.commit()

    temp_message_not_fp = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        False,
        helper_doc,
        "Approved",
        "Your document has been reviewed and has been Approved.",
    )
    # TODO: just use the given document's status instead of passing it to the message?
    db.session.add(temp_message_not_fp)
    db.session.commit()

    rs = client.get("/messages/fp/" + helper_field_partner.id)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert len(ret_dict["result"]["messages"]) == 1
    assert ret_dict["result"]["messages"][0]["status"] == helper_doc.status

    cleanup()


def test_get_messages_by_pm(client):
    helper_portfolio_manager = create_pm("kelleyc2@illinois.edu", "Kelley")
    helper_docclass = create_docclass("ksdljf")
    db.session.commit()

    helper_field_partner = create_fp(
        "kchau490@gmail.com", "hack4impact", helper_portfolio_manager, "Complete"
    )
    helper_doc = create_document(
        "kjdslfjdskl", "jsdlkfjdskf", "Pending", helper_docclass
    )
    db.session.commit()

    temp_message = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        True,
        helper_doc,
        helper_doc.status,
        "Your document has been reviewed and has been Approved.",
    )
    # TODO: just use the given document's status instead of passing it to the message?
    db.session.add(temp_message)
    db.session.commit()

    temp_message_not_fp = create_message(
        helper_portfolio_manager,
        helper_field_partner,
        False,
        helper_doc,
        "Approved",
        "Your document has been reviewed and has been Approved.",
    )
    # TODO: just use the given document's status instead of passing it to the message?
    db.session.add(temp_message_not_fp)
    db.session.commit()

    rs = client.get("/messages/pm/" + helper_portfolio_manager.id)

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert len(ret_dict["result"]["messages"]) == 1
    assert ret_dict["result"]["messages"][0]["status"] == "Approved"

    cleanup()


def test_add_message(client):
    helper_portfolio_manager = create_pm("kelleyc2@illinois.edu", "Kelley")
    helper_docclass = create_docclass("ksdljf")
    db.session.commit()

    helper_field_partner = create_fp(
        "kchau490@gmail.com", "hack4impact", helper_portfolio_manager, "Complete"
    )
    helper_doc = create_document(
        "kjdslfjdskl", "jsdlkfjdskf", "Pending", helper_docclass
    )
    db.session.commit()

    rs = client.post(
        "/messages/new",
        content_type="multipart/form-data",
        data={
            "pm_id": helper_portfolio_manager.id,
            "fp_id": helper_field_partner.id,
            "to_fp": True,
            "doc_id": helper_doc.id,
            "status": "Approved",
        },
    )

    assert rs.status_code == 200
    ret_dict = rs.json  # gives you a dictionary
    assert int(ret_dict["result"]["message"]["doc_id"]) == helper_doc.id
    assert ret_dict["result"]["message"]["pm_id"] == helper_portfolio_manager.id
    assert ret_dict["result"]["message"]["fp_id"] == helper_field_partner.id
    assert ret_dict["result"]["message"]["status"] == "Approved"
    assert ret_dict["result"]["message"]["to_fp"] == str(True)
    assert (
        ret_dict["result"]["message"]["description"]
        == "Your document has been reviewed and was Approved."
    )

    cleanup()
