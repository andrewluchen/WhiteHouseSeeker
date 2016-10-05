from datetime import datetime
import json

from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User, Group
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View

from usgs import forms, models, utils
from usgs.bill.views import NewBillView, BillView, BillVersionView, ClerkView, BillsView
from usgs.character.views import NewCharacterView, CharacterView, CharactersView

def echo(request):
    print ('request: ', request)
    print ('user: ', request.user)
    print ('username: ', request.user.username)
    print ('is_authenticated: ', request.user.is_authenticated)

class Index(View):

    def get(self, request):
        utils.initialize()
        return render(request, 'index.html')

class Leaders(View):

    def get(self, request):
        obj = models.Leadership.objects.all().first()
        if (obj == None):
            obj = models.Leadership()
            obj.save()
        response = serializers.serialize('json', [obj,])
        return HttpResponse(response, content_type='application/json')
