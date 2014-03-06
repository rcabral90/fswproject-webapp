# Create your views here.
import urllib2
import base64
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from fswproject_webapp.settings import FSW_WEBSERVICE_BASE_URL


def home(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('home.html', context)


def login(request):
    username = request.POST["username"]
    password = request.POST["password"]

    url = FSW_WEBSERVICE_BASE_URL + "/user_auth/"
    print url
    request = urllib2.Request(url)
    base64string = base64.encodestring('%s:%s' % (username, password)).replace('\n', '')
    request.add_header("Authorization", "Basic %s" % base64string)
    result = urllib2.urlopen(request)
    print result.read()
    return render(result.read(), content_type="application/json",
                  context_instance=RequestContext(request))