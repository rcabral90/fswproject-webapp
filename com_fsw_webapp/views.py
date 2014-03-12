from django.core.context_processors import csrf
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from com_fsw_service.user_authentication import login_user


def home(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('home.html', {"error": False}, context_instance=RequestContext(request))


def login(request):
    try:
        user = login_user(request)
        if user != "":
            return render_to_response('dashboard.html', {"user": user}, context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": True}, context_instance=RequestContext(request))
    except:
        return render_to_response('home.html', {"error": True}, context_instance=RequestContext(request))