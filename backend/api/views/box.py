from boxsdk import Client, OAuth2
from boxsdk.network.default_network import DefaultNetwork
from boxsdk.exception import BoxAPIException

from api.views.auth import verify_token
from boxsdk import JWTAuth

from io import BytesIO
import os

from flask import Blueprint, request
from api.models import Document, Message, db

from api.core import create_response, serialize_list, logger

import requests, json, jwt, os, time, secrets

from urllib.request import urlopen
from urllib.request import Request
from urllib.parse import urlencode

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import load_pem_private_key

box = Blueprint("box", __name__)

"""
TODO:   RETRIEVE INFORMATION FROM BACKEND TABLE
        PUSH INFORMATION TO FRONTEND
"""

# One time authentication for the application
_CRED_FILE = "api/views/171399529_b8tan54x_config.json"
sdk = JWTAuth.from_settings_file(_CRED_FILE)
client = Client(sdk)

# enough space for user allocation
SPACE = 1073741824


@box.route("/box/token", methods=["GET"])
def get_access_token():
    token = request.headers.get("token")
    message, info = verify_token(token)

    # if message != None:
    #    return create_response(status=400, message=message)

    config = json.load(open("api/views/171399529_b8tan54x_config.json"))

    keyId = config["boxAppSettings"]["appAuth"]["publicKeyID"]

    appAuth = config["boxAppSettings"]["appAuth"]
    privateKey = appAuth["privateKey"]
    passphrase = appAuth["passphrase"]

    # To decrypt the private key we use the cryptography library
    key = load_pem_private_key(
        data=privateKey.encode("utf8"),
        password=passphrase.encode("utf8"),
        backend=default_backend(),
    )

    authentication_url = "https://api.box.com/oauth2/token"

    claims = {
        "iss": config["boxAppSettings"]["clientID"],
        "sub": config["enterpriseID"],
        "box_sub_type": "enterprise",
        "aud": authentication_url,
        # This is an identifier that helps protect against
        # replay attacks
        "jti": secrets.token_hex(64),
        # We give the assertion a lifetime of 45 seconds
        # before it expires
        "exp": round(time.time()) + 45,
    }

    # Rather than constructing the JWT assertion manually, we are
    # using the pyjwt library.
    assertion = jwt.encode(
        claims,
        key,
        # The API support "RS256", "RS384", and "RS512" encryption
        algorithm="RS512",
        headers={"kid": keyId},
    )

    params = urlencode(
        {
            # This specifies that we are using a JWT assertion
            # to authenticate
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            # Our JWT assertion
            "assertion": assertion,
            # The OAuth 2 client ID and secret
            "client_id": config["boxAppSettings"]["clientID"],
            "client_secret": config["boxAppSettings"]["clientSecret"],
        }
    ).encode()

    # Make the request, parse the JSON,
    # and extract the access token
    check = Request(authentication_url, params)
    response = urlopen(check).read()
    access_token = json.loads(response)["access_token"]
    return create_response(data={"access_token": access_token})


def create_user(username):
    user = client.create_user(username, None, space_amount=SPACE)


def get_user_information(client, user_id):
    """
    Get user information
    Example: 
        {
            "type": "user",
            "id": "234630582",
            "name": "Jeff Boxdev",
            "login": "jrmeadows2+boxdev2015@gmail.com",
            "created_at": "2015-03-22T16:47:53-07:00",
            "modified_at": "2015-04-06T14:08:25-07:00",
            "language": "en",
            "timezone": "America/Los_Angeles",
            "space_amount": 10737418240,
            "space_used": 0,
            "max_upload_size": 262144000,
            "status": "active",
            "job_title": "",
            "phone": "4126068527",
            "address": "",
            "avatar_url": "https://app.box.com/api/avatar/large/234630582"
        }
    ### Return JSON
    """

    info = client.user(user_id=user_id).get()
    return info


"""
def upload_file_redirect():
    data = request.files.get("file")
    file_name = request.form.get("file_name")
    box_file = upload_file(data, file_name)
    if box_file is not None:
        file_id = box_file["id"]

        new_data = Document(7, "Post Document Test File", file_id)
        db.session.add(new_data)
        db.session.commit()
        return create_response(status=200, message="success")
    else:
        return create_response(status=400, message="Duplicate file name")


"""


def upload_file(file, file_name, folder_id="0"):
    """
    Upload the file with the given content and file.
    ### Return the id of the file if successful
    ### Return None if otherwise
    """

    stream = BytesIO()
    stream.write(file.read())
    stream.seek(0)
    try:
        box_file = client.folder(str(folder_id)).upload_stream(
            stream, file_name, preflight_check=True
        )

        # get shared link
        link = client.file(box_file.id).get_shared_link(access="open")

        # insert "embed" at proper location to get the embeddable versionn
        embed_link = link[: link.find("/s")] + "/embed" + link[link.find("/s") :]

        return {"file": box_file, "link": embed_link}
    except BoxAPIException:
        return None


def delete_file(id):
    """
    deletes file with the given id
    returns True on success and False on failure
    """
    try:
        client.file(file_id=str(id)).delete()
        return True
    except BoxAPIException:
        return False


def get_file_info(client, file_id):
    """
    get file info
    """
    file_info = client.file(file_id).get()

    return file_info


@box.route("/box/download", methods=["GET"])
def download_file():
    data = request.form

    if data is None:
        return create_response(status=200, message="No data provided")

    if "file_id" not in data:
        return create_response(status=200, message="No file ID provided")

    file_id = data.get("file_id")
    box_file = client.file(file_id).get()
    output_file = open(box_file.name, "wb")
    box_file.download_to(output_file)

    path_box = os.path.abspath(output_file)
    return create_response(
        data={"output": send_file(path_box, attachment_filename=file_id)}
    )


def delete_file(file_id):
    client.file(file_id).delete()


def add_comment(file_id, message):
    comment = client.file(file_id).add_comment(message)

    return comment


def get_comment(comment_id):
    comment = client.comment(comment_id).get()

    return comment


def update_comment(comment_id, new_message):
    edited_comment = client.comment(comment_id).edit(new_message)

    return edited_comment


def delete_comment(comment_id):
    client.comment(comment_id).delete()


def create_link(file_id):
    access_level = "open"
    file = client.file(file_id)
    link = file.get_shared_link(access=access_level)

    return link


def find_files_by_content(content_query):
    """
    Find files with the same content
    ### Return a list of file names
    """
    result = client.search().query(content_query)
    output = []

    for i in result:
        output.append(i)

    return output


def clear_box():
    items = client.folder(folder_id="0").get_items()
    for item in items:
        if item["type"] == "folder":
            client.folder(folder_id=(item["id"])).delete()
        else:
            client.file(file_id=item["id"]).delete()


def create_pm_folder(name):
    """
    creates a folder for a portfolio manager with the root as the parent
    """
    return client.folder("0").create_subfolder(str(name))["id"]


def create_fp_folder(name, folder_id):
    """
    creates a folder for a field partner with its portfolio manager's folder as the parent
    """
    return client.folder(str(folder_id)).create_subfolder(str(name))["id"]
