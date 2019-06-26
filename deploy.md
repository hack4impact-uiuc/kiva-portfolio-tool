# Deploying to Heroku
The current repository should have the Dockerfiles setup for both the frontend and backend directories. The authentication server is deployed at another location from another team within Hack4Impact. This document will walk through the steps to deploy the frontend and backend on Heroku.

## Backend
### Heroku Deployment
Heroku allows you to easily deploy your application without worrying about dependencies and how to set up your server. Once it's set up you can just push your code to Heroku and it will automatically update.<br>
**You must have a Heroku Account and have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed on your computer.** 

First, login into Heroku and the container registry in your command line:
```
$ heroku login
$ heroku container:login
```
Create a new Heroku application with:
```
$ heroku create
```
Be sure to save the application name for future commands. Next, we need to add the PostgreSQL addon for our database. To double check whether you have the postgres add-on:
```
$ heroku addons
```
And you should get something with ```heroku-postgresql (postgresql-metric-75135)```. If this doesn't appear or you don't have the PostgreSQL addon, be sure to add the addon to your Heroku app with:
```
$ heroku addons:create heroku-postgresql:<PLAN_NAME> --app <APP NAME>
```
To let Heroku know get the Production Configurations, we will have to set an environment variable ```FLASK_ENV``` to ```"prod"```. 
```
$ heroku config:set FLASK_ENV="prod"	
```
Before we can get the correct tables recognized and migrated, we need to push the actual application to Heroku. Build the Docker image with:
```
$ docker build --tag=<IMAGE NAME> .
```
Then tag and push the image to the container registry:
```
$ docker tag <IMAGE NAME> registry.heroku.com/<APP NAME>/web
$ docker push registry.heroku.com/<APP NAME>/web
```
Then release the image to the application:
```
$ heroku container:release web --app <APP NAME>
```
After pushing your app to heroku, you need to migrate and update heroku postgres:
```
$ heroku run bash
~ $ python manage.py db init
~ $ python manage.py db migrate
~ $ python manage.py db upgrade
```
Finally, open up your live app by running:
```
$ heroku open --app <APP NAME>
```
And everything should be all set!

**Note: You will need to change the localhost:5000 links in the backend files to the link of the Heroku backend application.**

### Heroku Postgres CLI 
A pretty neat command to go into the heroku postgres CLI is:
```
$ heroku pg:psql
```
Note: You are already inside your database!
### Version Errors when migrating database
This happens when the alembic table SQLAlchemy uses screws up. You must remove it and migrate the database again.<br>
Go into the Heroku postgres database
```
$ heroku pg:psql
```
Then, delete the alembic table.
``` 
# DROP TABLE alembic_version;
```
Go into your Heroku CLI and remigrate your database
```
$ heroku run bash
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
```
### Resetting your Database
For the first step you have two options, for the first option you should go into your heroku backend's postgress add-on, then go to the settings page and press **Reset Database**.
<br>
The second option is to type this into your terminal:

```
$ heroku pg:reset DATABASE
```

Go into your Heroku CLI and remigrate your database
```
$ heroku run bash
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
$ python manage.py recreate_db
```

## Frontend
Change the backend url in `src/utils/ApiConfig.js` from http://127.0.0.1:5000 to whatever your Heroku backend's url is.

To create a new heroku app out of your frontend repository
```
$ heroku create
```
Before we can use the frontend, we need to push the actual application to Heroku. Build the Docker image with:
```
$ docker build --tag=<IMAGE NAME> .
```
Then tag and push the image to the container registry:
```
$ docker tag <IMAGE NAME> registry.heroku.com/<APP NAME>/web
$ docker push registry.heroku.com/<APP NAME>/web
```
Then release the image to the application:
```
$ heroku container:release web --app <APP NAME>
```
Then you should be able to open the application with:
```
$ heroku open --app <APP NAME>
```
And everything should be all set!

**Note: You will need to change the localhost:3000 links to the link of the frontend Heroku application.**