import random
import string

from django.core.context_processors import csrf
from django.core.mail import send_mail, BadHeaderError
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
import simplejson as json
from django import forms
from com_fsw_service.user_authentication import login_user, logout_user

backend_url = getattr(settings, "FSW_WEBSERVICE_BASE_URL", None)


def home(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('home.html', {"error": False,
                                            "backend_url": backend_url}, context_instance=RequestContext(request))


def selector(request):
    if request.method == "POST":
        # try to set vars
        request.session['current_resident'] = request.POST['resident_id']
        # push to dashboard
        if request.session.get('user') != "":
            return render_to_response('dashboard.html', {"user": request.session.get('user'),
                                                         "last_seen": request.session.get('last_seen'),
                                                         "resident_id": request.session.get('current_resident'),
                                                         "backend_url": backend_url},
                                      context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": False,
                                                    "backend_url": backend_url},
                                      context_instance=RequestContext(request))
    if request.method == "GET":
        # if we still have session vars open return to that patient
        if request.session.get('user') != "":
            return render_to_response('dashboard.html', {"user": request.session.get('user'),
                                                         "last_seen": request.session.get('last_seen'),
                                                         "resident_id": request.session.get('current_resident'),
                                                         "backend_url": backend_url},
                                      context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": False,
                                                    "backend_url": backend_url},
                                      context_instance=RequestContext(request))


def alert_page(request):
    return render_to_response('alerts.html',
                              {"user": request.session.get('user'), "last_seen": request.session.get('last_seen'),
                               "resident_id": request.session.get('current_resident'),
                               "backend_url": backend_url},
                              context_instance=RequestContext(request))


def log_page(request):
    return render_to_response('logs.html',
                              {"user": request.session.get('user'), "last_seen": request.session.get('last_seen'),
                               "resident_id": request.session.get('current_resident'),
                               "backend_url": backend_url},
                              context_instance=RequestContext(request))


def login(request):
    try:
        user = login_user(request)
        if user != "":
            request.session.set_expiry(0)
            request.session['user'] = user.username
            request.session['is_staff'] = user.is_staff
            request.session['current_resident'] = 0
            return render_to_response('patient_select.html', {"user": user,
                                                              "backend_url": backend_url},
                                      context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": True,
                                                    "backend_url": backend_url},
                                      context_instance=RequestContext(request))
    except:
        return render_to_response('home.html', {"error": True,
                                                "backend_url": backend_url}, context_instance=RequestContext(request))


def logout(request):
    try:
        success = logout_user()
        if success != 0:
            request.session['user'] = ''
            request.session['current_resident'] = ''
            return render_to_response('home.html', {"error": False,
                                                    "backend_url": backend_url},
                                      context_instance=RequestContext(request))
        else:
            return render_to_response('home.html', {"error": True,
                                                    "backend_url": backend_url},
                                      context_instance=RequestContext(request))
    except ValueError:
        return render_to_response('home.html', {"error": True,
                                                "backend_url": backend_url}, context_instance=RequestContext(request))


def print_page(request):
    return render_to_response('print_details.html',
                              {"user": request.session.get('user'), "last_seen": request.session.get('last_seen'),
                               "resident_id": request.session.get('current_resident'),
                               "backend_url": backend_url},
                              context_instance=RequestContext(request))


def add_resident(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('add_resident.html', {"error": False,
                                                    "backend_url": backend_url},
                              context_instance=RequestContext(request))


def add_doctor(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('add_doctor.html', {"error": False,
                                                  "backend_url": backend_url}, context_instance=RequestContext(request))


def edit_doctor_list(request):
    context = {}
    context.update(csrf(request))
    return render_to_response('edit_doctor_list.html', {"error": False,
                                                        "backend_url": backend_url},
                              context_instance=RequestContext(request))


class DocumentForm(forms.Form):
    photo = forms.FileField(label='Select a file')


def upload_photo(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            generated_filename = "/root/fswproject-webapp/static/img_uploads/" + ''.join(
                random.choice(string.ascii_uppercase + string.digits) for _ in range(8)) + request.FILES['photo'].name

            handle_uploaded_file(request.FILES['photo'], generated_filename)
            return HttpResponse(json.dumps({'success': '1', 'filename': generated_filename[24:]}),
                                content_type="application/json")
        else:
            return HttpResponse(json.dumps({'success': '0', 'error': 'File upload error, bad form.'}),
                                content_type="application/json")
    else:
        return HttpResponse(json.dumps({'success': '0', 'error': 'File upload error, non post method!'}),
                            content_type="application/json")


def feedback(request):
    subject = request.POST.get('subject', '')
    message = request.POST.get('message', '')
    from_email = request.POST.get('email', '')
    name = request.POST.get('name', '')

    if subject and message and from_email:
        try:
            send_mail(subject,
                      "FROM: " + name + "\n\n" + "SUBJECT: " + subject + "\n\n" + message + "\n\n" + "EMAIL: " + from_email,
                      from_email, ['fswclient@gmail.com'])
        except BadHeaderError:
            return HttpResponse('Invalid header found.', context_instance=RequestContext(request))
        return render_to_response('feedbackthanks.html', context_instance=RequestContext(request))
    else:
        return render_to_response('feedback.html', context_instance=RequestContext(request))


def thanks(request):
    return render_to_response('feedbackthanks.html', context_instance=RequestContext(request))


def about(request):
    return render_to_response('about_csuf.html', context_instance=RequestContext(request))


def handle_uploaded_file(f, generated_filename):
    with open(generated_filename, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
