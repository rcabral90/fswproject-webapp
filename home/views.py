# Create your views here.
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.template import Template, Context, loader
from django.shortcuts import render, redirect
from django.contrib import auth


def starter(request):
    return render(request, 'base/base_extender_starter.html')
    #return render(request,'starter/starter-template.html')


def hero(request):
    return render(request, 'base/base_extender_hero.html')
    #return render(request,'hero/hero.html')


def hero(request):
    return render(request, 'base/base_extender_hero.html')
    #return render(request,'hero/hero.html')


def user_login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)

    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect('/starter/')
        else:
            print("yolo")
    else:
        print("brolo")







    

