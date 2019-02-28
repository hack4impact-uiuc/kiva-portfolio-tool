from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from api import create_app
from api.models import db, Document
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
        id=0, requirement="Board of Directors", name=None, status="Missing"
    )
    create_mock_document(
        id=1, requirement="Auditor Letter", name=None, status="Missing"
    )
    create_mock_document(
        id=2,
        requirement="Income Statement",
        name="income_statement.pdf",
        status="Pending",
    )
    create_mock_document(
        id=3, requirement="Balance Sheet", name="balance_sheet.pdf", status="Pending"
    )
    create_mock_document(
        id=4, requirement="Strategic Plan", name="strategic_plan.pdf", status="Rejected"
    )
    create_mock_document(
        id=5, requirement="Annual Plan", name="annual_plan.pdf", status="Rejected"
    )
    create_mock_document(
        id=6,
        requirement="Financial Projections",
        name="financial_proj.pdf",
        status="Approved",
    )
    create_mock_document(
        id=7,
        requirement="Organizational Chart",
        name="org_chart.pdf",
        status="Approved",
    )

    db.session.commit()


def create_mock_document(id, requirement, name, status):
    if name is not None:
        d = Document(
            fileID=str(id),
            userID=str(id),
            date=datetime.today(),
            status=status,
            docType=requirement,
            docName=name,
            latest=True,
            description="",
        )
    else:
        d = Document(
            fileID=str(id),
            userID=str(id),
            date=None,
            status=status,
            docType=requirement,
            docName=None,
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
