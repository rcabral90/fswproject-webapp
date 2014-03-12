import urllib
import urllib2
from fswproject_webapp.settings import FSW_WEBSERVICE_BASE_URL
from com_fsw_service.response_mapper import map_user


def login_user(request):
    url = FSW_WEBSERVICE_BASE_URL + "/user_auth/"
    data = urllib.urlencode(request.POST)
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    user = map_user(response.read())
    return user
