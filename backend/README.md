# Backend Documentation

## Box API Setup

To start using Box, you must create a box account [here](https://account.box.com/login).

After you create your new box account, you must visit the [Console](https://app.box.com/developers/console) to create your project.

After creating your project, click into the project and go to **configuration**.

In *configuration* tab, decide whether or not you want to authenticate using _OAuth_ or _JWT_. You can find more documentation about these two methods [here](https://developer.box.com/docs/quickstart-guides).

Follow each step in the chosen authentication method, and you are all set!

This project uses the _JWT_ method to authenticate one master user and allow anyone with access to the project upload, delete, and more with box. By using the _JWT_ method, you must download the **App Settings** from your **configuration**, which is located all the way down in the page. After you download it, follow the [documentation](https://developer.box.com/docs/construct-jwt-claim-manually), and you will be able to set up the box account similar to this project's.

Our box backend first generates the access token for the authenticated user (information in the document provided above) and lets the user upload a file or delete a file. More on these endpoints can be found [here](https://developer.box.com/reference)

### Box Api Document
This [Box api document](https://developer.box.com/reference) has all the endpoints described for your own box integration.

## Email Notification Setup

The email notifications are sent using the Gmail SMTP server. If you do not have a G Suite account with a custom domain, you can only send 100 emails/day; otherwise, it is unlimited.

If you want to use your own Gmail account to send emails, follow [this](https://u.expressionengine.com/article/using-gmail-smtp-to-send-emails-from-your-website) (just through **Create an App Password for your Google Account**) to set up your account. Then, create a .env file in `/backend/api/`, containing:
```
GMAIL_NAME={your email}
GMAIL_PASSWORD={app password}
```
with your information instead of {these}.

## Postgres Setup

Follow the instructions for your operating system's setup in the [Flask Boilerplate Wiki](https://github.com/tko22/flask-boilerplate/wiki).

If you are running on Windows and using WSL to develop, you'll also need to install Postgres on your Ubuntu distribution for your tests to pass locally.

To do so, run the following in bash:

```
sudo apt-get install postgresql
```

## Database Setup

The following should be run the first time you create the database as well as any time the structure of the database changes (i.e. changes to a file in `api/models`). Activate `venv` in the `backend` directory before running the following:

```
python manage.py db init
python manage.py db migrate
python manage.py db upgrade
```
### Common Issues & Errors

#### Issues

* You may need to run the above using the `python3` instead of `python` if you haven't assigned `python` to execute with Python 3.

* Make sure you're running them from exactly the `backend` directory.

#### Errors

> When I run db init, I get the following error message: "alembic.util.exc.CommandError: Directory migrations already exists"

Delete `backend/migrations`. However, you'll likely also run into the next issue.

> When I run db migrate, I get the following error" alembic.util.exc.CommandError: Can't locate revision identified by [hash]"

Connect to Postgres and run the following: 

```SQL
\c testdb

DROP TABLE alembic_version;
```

## Anything below this line is from the Flask Boilerplate documentation.

# Flask Boilerplate [![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/tko22/flask-boilerplate&env=DATABASE_URL)

This is an minimal but opinionated boilerplate meant for building out simple REST APIs. It is primarily used at [Hack4Impact UIUC](https://github.com/hack4impact-uiuc). This app is written in Python 3.6 with Postgres 10 as the chosen data persistence. The default way to deploy it is with Heroku or Zeit now but you can deploy it with another service, like AWS, Google Cloud, or DigitalOcean with Gunicorn and Nginx, but instructions for that are not provided. Included are simple examples and instructions developing with or without Docker are provided. I've also written a <a href="https://medium.freecodecamp.org/docker-development-workflow-a-guide-with-flask-and-postgres-db1a1843044a">blog post</a> about using Docker based on this repository.<br>

Documentation is located [here](https://github.com/tko22/flask-boilerplate/wiki). We use [black](https://github.com/ambv/black) for code formatting, and [mypy](http://mypy-lang.org/) for optional static typing.

![](../master/docs/flask.gif)

## Goal

The goal of this boilerplate is to allow developers to quickly write their API with code structured to best practices while giving them flexibility to easily add/change features. Here are the problems this is trying to solve:

1.  **Flask is too flexible.** With Flask, you can write your application in any structure you like, even in one file. There are also a lot of different tutorials and guides providing different instructions & application structures to set up a Flask app with a database, confusing many newcomers about best practices.

2.  **Django and other Flask boilerplates are too heavy.** Sometimes, I don't need a fully featured admin portal with Redis and an Email manager nor do I need templates. Many APIs and applications require the use of a database though. Thus, I've chosen Postgres because it is a battle-tested and reliable database used in many companies and we know that 99% of applications can easily be designed to use relational databases (especially the ones used at Hack4Impact).

## Docs

Please Please **PLEASE** read the documentation if you don't understand something relevant to this boilerplate. Documentation is provided in the [wiki page](https://github.com/tko22/flask-boilerplate/wiki) of this repository. I've also added comments with links to specific Flask Documentation to explain certain design choices and/or a specific Flask API (ex: test clients).

## Usage

Here are some quickstart instructions, although I would look at the [documentation](https://github.com/tko22/flask-boilerplate/wiki) for more details.

First start a postgres docker container and persist the data with a volume `flask-app-db`:

```
docker run -e POSTGRES_USER=testusr -e POSTGRES_PASSWORD=password -e POSTGRES_DB=testdb -p 5432:5432 -v flask-app-db:/var/lib/postgresql/data -d postgres:10
```

Another option is to create a postgres instance on a cloud service like elephantsql and connect it to this app. Remember to change the postgres url and don't hard code it in!

**If you're running postgres locally through brew, start your postgres using:** `brew services start postgresql`

Then, start your virtual environment

```
$ pip3 install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```
Now, install the python dependencies and run the server:
```
(venv) $ pip install -r requirements.txt
(venv) $ pip install -r requirements-dev.txt
(venv) $ python manage.py recreate_db
(venv) $ python manage.py runserver
```

To exit the virtual environment:
```
(venv) $ deactivate
$
```

For ease of setup, I have hard-coded postgres URLs for development and docker configurations. If you are using a separate postgres instance as mentioned above, _do not hardcode_ the postgres url including the credentials to your code. Instead, create a file called `creds.ini` in the same directory level as `manage.py` and write something like this:

```
[pg_creds]
pg_url = postgresql://testusr:password@127.0.0.1:5432/testdb
```

For production, you should do something similar with the flask `SECRET_KEY`. Environment variables can also be used, but may require editing the .env file in the directory at the same level as `manage.py` as well as the `config.py` and `core.py` files.

#### Deployment

You may use Heroku and the instructions are defined in the [wiki page](https://github.com/tko22/flask-boilerplate/wiki). I prefer [Zeit now](https://zeit.co/now) for their easy docker serverless
deployments. To deploy, you must have the now cli and then run:

```
now -e DATABASE_URL=your_postgres_url
```

Note that you will need a postgres instance somewhere. Remember to run `python manage.py recreate_db` to initialize all of the tables in the beginning! You may also use [now secrets](https://zeit.co/docs/getting-started/secrets) and put them
into the the optional zeit now [config file](https://zeit.co/docs/static-deployments/configuration) `now.json`.

### Repository Contents

- `api/views/` - Holds files that define your endpoints
- `api/models/` - Holds files that defines your database schema
- `api/__init__.py` - What is initially ran when you start your application
- `api/utils.py` - utility functions and classes - explained [here](https://github.com/tko22/flask-boilerplate/wiki/Conventions)
- `api/core.py` - includes core functionality including error handlers and logger
- `api/wsgi.py` - app reference for gunicorn
- `tests/` - Folder holding tests

#### Others

- `config.py` - Provides Configuration for the application. There are two configurations: one for development and one for production using Heroku.
- `manage.py` - Command line interface that allows you to perform common functions with a command
- `requirements.txt` - A list of python package dependencies the application requires
- `runtime.txt` & `Procfile` - configuration for Heroku
- `Dockerfile` - instructions for Docker to build the Flask app
- `docker-compose.yml` - config to setup this Flask app and a Database
- `migrations/` - Holds migration files – doesn't exist until you `python manage.py db init` if you decide to not use docker

### MISC

If you're annoyed by the **pycache** files

```
find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf
```

### Additional Documentation

- [Flask](http://flask.pocoo.org/) - Flask Documentation
- [Flask Tutorial](http://flask.pocoo.org/docs/1.0/tutorial/) - great tutorial. Many patterns used here were pulled from there.
- [Flask SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.3/) - the ORM for the database
- [Heroku](https://devcenter.heroku.com/articles/getting-started-with-python#introduction) - Deployment using Heroku
- [Learn Python](https://www.learnpython.org/) - Learning Python3
- [Relational Databases](https://www.ntu.edu.sg/home/ehchua/programming/sql/Relational_Database_Design.html) - Designing a database schema
- [REST API](http://www.restapitutorial.com/lessons/restquicktips.html) - tips on making an API Restful
- [Docker Docs](https://docs.docker.com/get-started/) - Docker docs

Feel free to contact me for questions and contributions are welcome :) <br>
tk2@illinois.edu
