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
        user_id=1, docclass_id=docclass_ids[0], name=None, status="Missing"
    )
    create_mock_document(
        user_id=1, docclass_id=docclass_ids[1], name=None, status="Missing"
    )
    create_mock_document(
        file_id=2,
        user_id=1,
        docclass_id=docclass_ids[2],
        name="income_statement.pdf",
        status="Pending",
    )
    create_mock_document(
        file_id=3,
        user_id=1,
        docclass_id=docclass_ids[3],
        name="balance_sheet.pdf",
        status="Pending",
    )
    create_mock_document(
        file_id=4,
        user_id=1,
        docclass_id=docclass_ids[4],
        name="strategic_plan.pdf",
        status="Rejected",
    )
    create_mock_document(
        file_id=5,
        user_id=1,
        docclass_id=docclass_ids[5],
        name="annual_plan.pdf",
        status="Rejected",
    )
    create_mock_document(
        user_id=1,
        file_id=6,
        docclass_id=docclass_ids[6],
        name="financial_proj.pdf",
        status="Approved",
    )
    create_mock_document(
        user_id=1,
        file_id=7,
        docclass_id=docclass_ids[7],
        name="org_chart.pdf",
        status="Approved",
    )

    db.session.commit()


def create_mock_docclass(docclass_name, docclass_description=None):
    docclass = DocumentClass(name=docclass_name, description=docclass_description)
    db.session.add(docclass)
    return docclass.id


def create_mock_document(user_id, docclass_id, name, status, file_id=None):
    if name is not None:
        d = Document(
            fileID=file_id,
            userID=str(user_id),
            date=datetime.today(),
            status=status,
            docClassID=docclass_id,
            fileName=name,
            latest=True,
            description="",
        )
    else:
        d = Document(
            fileID=file_id,
            userID=str(user_id),
            date=None,
            status=status,
            docClassID=docclass_id,
            fileName=None,
            latest=None,
            description="",
        )

    db.session.add(d)


@manager.command
def clear_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


if __name__ == "__main__":
    manager.run()
