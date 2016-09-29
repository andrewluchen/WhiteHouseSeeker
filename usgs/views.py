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

def initialize():
    bodies = [
        'library',
        'potus_desk',
        'senate',
        'house',
        'concomm',
        'graveyard',
    ]
    for body in bodies:
        b = models.LegislativeBody.objects.get(name=body).first()
        b.save()

def get_leg_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber).first()
    if (chamber == None):
        initialize()
        chamber = models.LegislativeBody.objects.get(name=chamber).first()
    return chamber

def is_admin(user):
    return False

class Capitol(View):

    def get(self, request):
        obj = models.Leadership.objects.all().first()
        if (obj == None):
            obj = models.Leadership()
            obj.save()
        response = serializers.serialize('json', [obj,])
        return HttpResponse(response, content_type='application/json')

    @user_passes_test(is_admin)
    def put(self, request):
        pass

class Bill(View):

    @staticmethod
    def newbill(request):
        print request.user
        return HttpResponse(400)
        title = request.POST['title']
        body = request.POST['body']
        sponsor_id = request.POST['sponsor_id']
        sponsor = models.Character.objects.get(id=sponsor_id)
        bill = models.Bill(title=title, body=body, sponsor=sponsor)
        bill.save()
        return HttpResponse(status=201)
