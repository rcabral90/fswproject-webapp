import json
from com_fsw_models.models import AuthUser


def map_user(response):
    try:
        response = json.loads(response)
        user = AuthUser(response["first_name"],
                        response["last_name"],
                        response["username"]
                        )
    except:
        user = ""

    return user