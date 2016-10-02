import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.views import View

from rest_framework_jwt.settings import api_settings

from usgs import forms

def jwt(user):
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
    payload = jwt_payload_handler(user)
    return jwt_encode_handler(payload)


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
        data = { 'id_token': jwt(user) }
        return HttpResponse(json.dumps(data), content_type="application/json")
    else:
        return HttpResponse(status=401)

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')
