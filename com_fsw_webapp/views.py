from django.core.context_processors import csrf
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from com_fsw_service.user_authentication import login_user
from django.shortcuts import redirect


def home(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('home.html', {"error": False}, context_instance=RequestContext(request))

def selector(request):
    if (request.session['current_resident'] == 0):
        #render selection page
        return render_to_response('patient_select.html', {"error": True}, context_instance=RequestContext(request))
    if (request.method == "POST"):
        #try to set vars
        request.session['current_resident'] = request.POST['resident_id']
        #push to dashboard
        return render_to_response('dashboard.html', {"user": request.session.get('user'),"resident_id": request.session.get('current_resident')}, context_instance=RequestContext(request))
def login(request):
    try:
        user = login_user(request)
        if user != "":
            request.session['user'] = user.username
            request.session['current_resident'] = 0
            #return redirect('/selector/')
            return render_to_response('dashboard.html', {"user": user}, context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": True}, context_instance=RequestContext(request))
    except:
        return render_to_response('home.html', {"error": True}, context_instance=RequestContext(request))

def add_user(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('add_user.html', {"error": False}, context_instance=RequestContext(request))        