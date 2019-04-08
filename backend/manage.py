#!/usr/bin/env python3
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from api import create_app
from api.models import db, Document, FieldPartner, PortfolioManager
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

    create_mock_document(
        user_id=1, requirement="Board of Directors", name=None, status="Missing"
    )
    create_mock_document(
        user_id=1, requirement="Auditor Letter", name=None, status="Missing"
    )
    create_mock_document(
        file_id=2,
        user_id=1,
        requirement="Income Statement",
        name="income_statement.pdf",
        status="Pending",
    )
    create_mock_document(
        file_id=3,
        user_id=1,
        requirement="Balance Sheet",
        name="balance_sheet.pdf",
        status="Pending",
    )
    create_mock_document(
        file_id=4,
        user_id=1,
        requirement="Strategic Plan",
        name="strategic_plan.pdf",
        status="Rejected",
    )
    create_mock_document(
        file_id=5,
        user_id=1,
        requirement="Annual Plan",
        name="annual_plan.pdf",
        status="Rejected",
    )
    create_mock_document(
        user_id=1,
        file_id=6,
        requirement="Financial Projections",
        name="financial_proj.pdf",
        status="Approved",
    )
    create_mock_document(
        user_id=1,
        file_id=7,
        requirement="Organizational Chart",
        name="org_chart.pdf",
        status="Approved",
    )

    db.session.commit()


def create_mock_document(user_id, requirement, name, status, file_id=None):
    if name is not None:
        d = Document(
            fileID=file_id,
            userID=str(user_id),
            date=datetime.today(),
            status=status,
            docClass=requirement,
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
            docClass=requirement,
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
