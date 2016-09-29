from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.views import View

from usgs import forms

def user_register(request):
    context = RequestContext(request)
    user_form = forms.UserForm(data=request.POST)

    if user_form.is_valid():
        user = user_form.save()
        user.set_password(user.password)
        user.save()
        return HttpResponse(status=201)
    else:
        return HttpResponse(status=400)

def user_login(request):
    context = RequestContext(request)
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)

    if user and user.is_active:
        login(request, user)
        return HttpResponseRedirect('/index')
    else:
        print "Invalid login details: {0}, {1}".format(username, password)
        return HttpResponse("Invalid login details supplied.")

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/index')
