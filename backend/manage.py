#!/usr/bin/env python3
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from api import create_app
from api.models import db, Document, FieldPartner, PortfolioManager, DocumentClass
from datetime import datetime

# sets up the app
app = create_app()

manager = Manager(app)
migrate = Migrate(app, db)

# adds the python manage.py db init, db migrate, db upgrade commands
manager.add_command("db", MigrateCommand)


@manager.command
def runserver():
    app.run(debug=True, host="0.0.0.0", port=5000)


@manager.command
def runworker():
    app.run(debug=False)


@manager.command
def recreate_db():
    """
    Recreates a database. This should only be used once
    when there's a new database instance. This shouldn't be
    used when you migrate your database.
    """
    db.drop_all()
    db.create_all()

    pm_id = create_mock_pm("kivaportfolio@gmail.com", "PM")

    db.session.commit()

    fp1_id = create_mock_fp("fp1@kiva.org", "FP 1", "In Process", pm_id)

    fp2_id = create_mock_fp("fp2@kiva.org", "FP 2", "New Partner", pm_id)

    fp3_id = create_mock_fp("fp3@kiva.org", "FP 3", "Complete", pm_id)

    db.session.commit()

    docclass_ids = []

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Board of Directors",
            docclass_description="List of board of directors",
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Auditor Letter",
            docclass_description="A letter by an auditor or something",
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Income Statement", docclass_description="Statement of income"
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Balance Sheet", docclass_description="A sheet of balance"
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Strategic Plan",
            docclass_description="A plan that describes strategy",
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Annual Plan",
            docclass_description="A plan describing the year",
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Financial Projections",
            docclass_description="Projections regarding finances for the year",
        )
    )

    docclass_ids.append(
        create_mock_docclass(
            docclass_name="Organizational Chart",
            docclass_description="A chart.. about organization",
        )
    )

    db.session.commit()

    create_mock_document(
        {
            "userID": fp1_id,
            "docClassID": docclass_ids[0],
            "fileName": None,
            "status": "Missing",
        }
    )
    create_mock_document(
        {
            "userID": fp1_id,
            "docClassID": docclass_ids[1],
            "fileName": None,
            "status": "Missing",
        }
    )
    create_mock_document(
        {
            "fileID": 2,
            "userID": fp1_id,
            "docClassID": docclass_ids[2],
            "fileName": "income_statement.pdf",
            "status": "Pending",
        }
    )
    create_mock_document(
        {
            "fileID": 3,
            "userID": fp1_id,
            "docClassID": docclass_ids[3],
            "fileName": "balance_sheet.pdf",
            "status": "Pending",
        }
    )
    create_mock_document(
        {
            "fileID": 4,
            "userID": fp1_id,
            "docClassID": docclass_ids[4],
            "fileName": "strategic_plan.pdf",
            "status": "Rejected",
        }
    )
    create_mock_document(
        {
            "fileID": 5,
            "userID": fp1_id,
            "docClassID": docclass_ids[5],
            "fileName": "annual_plan.pdf",
            "status": "Rejected",
        }
    )
    create_mock_document(
        {
            "userID": fp1_id,
            "fileID": 6,
            "docClassID": docclass_ids[6],
            "fileName": "financial_proj.pdf",
            "status": "Approved",
        }
    )
    create_mock_document(
        {
            "userID": fp1_id,
            "fileID": 7,
            "docClassID": docclass_ids[7],
            "fileName": "org_chart.pdf",
            "status": "Approved",
        }
    )

    db.session.commit()


def create_mock_pm(email, name):
    pm = PortfolioManager({"email": email, "name": name})
    db.session.add(pm)
    return pm.id


def create_mock_fp(email, org_name, app_status, pm_id):
    fp = FieldPartner(
        {"email": email, "org_name": org_name, "app_status": app_status, "pm_id": pm_id}
    )
    db.session.add(fp)
    return fp.id


def create_mock_docclass(docclass_name, docclass_description=None):
    docclass = DocumentClass(
        {"name": docclass_name, "description": docclass_description}
    )
    db.session.add(docclass)
    return docclass.id


def create_mock_document(data):
    d = Document(data)

    db.session.add(d)


@manager.command
def clear_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


if __name__ == "__main__":
    manager.run()
