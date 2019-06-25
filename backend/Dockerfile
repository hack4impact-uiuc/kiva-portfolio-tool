# this dockerfile is used for product deployments
FROM python:3.7
LABEL maintainer "Timothy Ko <tk2@illinois.edu>"

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

# for the flask config
ENV FLASK_ENV="prod"

EXPOSE 5000
CMD [ "python", "manage.py", "runserver"]