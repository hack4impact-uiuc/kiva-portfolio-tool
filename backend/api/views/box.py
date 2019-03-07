from boxsdk import Client, OAuth2
from boxsdk.network.default_network import DefaultNetwork
from pprint import pformat
from secret import CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN
from StringIO import StringIO
from boxsdk.exception import BoxAPIException

from boxsdk import JWTAuth
from boxsdk import Client

"""
TODO:   RETRIEVE INFORMATION FROM BACKEND TABLE
        PUSH INFORMATION TO FRONTEND
"""

# One time authentication for the application
_CRED_FILE = "/171399529_73anvn29_config.json"


def create_client():
    """
    Authenticate the user using the JWT.
    ### Return box client
    """
    sdk = JWTAuth.from_settings_file(_CRED_FILE)
    client = Client(sdk)
    return client


# enough space for user
SPACE = 1073741824


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


def upload_file(client, file_path, file_name, folder_id):
    """
    Upload the file with the given content and file.
    ### Return the id of the file if successful
    ### Return None if otherwise
    """

    box_file = client.folder(folder_id).upload(file_path, file_name)
    return box_file


def get_file_info(client, file_id):
    """
    get file info
    """
    file_info = client.file(file_id).get()

    return file_info


def download_file(client, file_id):
    box_file = client.file(file_id).get()
    output_file = open(box_file.name, "wb")
    box_file.download_to(output_file)

    return output_file


def delete_file(client, file_id):
    client.file(file_id).delete()


def add_comment(client, file_id, message):
    comment = client.file(file_id).add_comment(message)

    return comment


def get_comment(client, comment_id):
    comment = client.comment(comment_id).get()

    return comment


def update_comment(client, comment_id, new_message):
    edited_comment = client.comment(comment_id).edit(new_message)

    return edited_comment


def delete_comment(client, comment_id):
    client.comment(comment_id).delete()


def create_link(client, file_id):
    access_level = "open"
    file = client.file(file_id)
    link = file.get_shared_link(access=access_level)

    return link


def find_files_by_content(client, content_query):
    """
    Find files with the same content
    ### Return a list of file names
    """
    result = client.search().query(content_query)
    output = []

    for i in result:
        output.append(i)

    return output
