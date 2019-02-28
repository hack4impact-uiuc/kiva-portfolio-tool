from boxsdk import Client, OAuth2
from boxsdk.network.default_network import DefaultNetwork
from pprint import pformat
from secret import CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN
from StringIO import StringIO
from boxsdk.exception import BoxAPIException


def auth_user():
    """
    Authenticate the user using the client id, secret, and access token.
    ### Return box client
    """

    oauth2 = OAuth2(CLIENT_ID, CLIENT_SECRET, access_token=ACCESS_TOKEN)
    client = Client(oauth2)
    return client


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


def upload_file(client, content, file):
    """
    Upload the file with the given content and file.
    ### Return the id of the file if successful
    ### Return None if otherwise
    """

    stream = StringIO()
    stream.write(content)
    stream.seek(0)
    try:
        box_file = client.folder("0").upload_stream(
            stream, "file", preflight_check=True
        )
        return box_file.id
    except BoxAPIException:
        return None


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
