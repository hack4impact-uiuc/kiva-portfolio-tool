from boxsdk import Client, OAuth2
from boxsdk import JWTAuth

from io import StringIO

CLIENT_ID = "oz5aszozl69l74ekct0wumlndid774o7"
CLIENT_SECRET = "SDM9epCLegZvqwHQFFtyJJR89Lngljke"
ACCESS_TOKEN = "OJQo2FSu6W8JR0jxZejnWbugFsuktoiN"

# oauth2 = OAuth2(CLIENT_ID, CLIENT_SECRET, access_token=ACCESS_TOKEN)
# client = Client(oauth2)

_CRED_FILE = "171399529_73anvn29_config.json"
sdk = JWTAuth.from_settings_file(_CRED_FILE)
client = Client(sdk)

stream = StringIO()
stream.write("asdfasdfasdf")
stream.seek(0)
box_file = client.folder("0").upload_stream(
    stream, "aweohinlksfd.txt", preflight_check=True
)
# uploaded_file = client.folder("0").upload('rose1.png')

print(box_file.id)

file_info = client.file(418676052591).get()
output_file = open(file_info.name, "wb")
file_info.download_to(output_file)
