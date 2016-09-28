import json

from django.contrib.auth.decorators import user_passes_test
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View

from usgs import models

def index(request):
    return render(request, 'index.html')

def echo(request):
    print(request)
    print(request.data)

def is_admin(user):
    return False

class Capitol(View):

    def get(self, request):
        objs = models.Leadership.objects.all()
        if (len(objs) != 0):
            obj = objs[0]
        else:
            obj = models.Leadership()
            obj.save()
        response = serializers.serialize('json', [obj,])
        return HttpResponse(response, content_type='application/json')

    @user_passes_test(is_admin)
    def put(self, request):
        pass
