import json
from com_fsw_models.models import AuthUser


def map_user(response):
    try:
        response = json.loads(response)
        user = AuthUser(response["first_name"],
                        response["last_name"],
                        response["username"],
                        response["is_staff"]
                        )
    except:
        user = ""

    return user


def map_logout(response):
    try:
        response = json.loads(response)
        return response["success"]
    except:
        return 0

