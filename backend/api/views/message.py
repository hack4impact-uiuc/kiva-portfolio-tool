from flask import Blueprint, request
from api.models.Message import Message
from api.core import create_response, serialize_list, logger

business = Blueprint("message", __name__)
