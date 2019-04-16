from boxsdk import Client, OAuth2
from boxsdk import JWTAuth

from io import StringIO

_CRED_FILE = "171399529_b8tan54x_config.json"
sdk = JWTAuth.from_settings_file(_CRED_FILE)
client = Client(sdk)

stream = StringIO()
stream.write("1asdfasdfasfdf")
stream.seek(0)
box_file = client.folder("0").upload_stream(
    stream, "aw1eohinlksfdas.txt", preflight_check=True
)

print(box_file.id)
