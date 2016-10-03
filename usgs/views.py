import json

from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User, Group
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View

from usgs import models
from usgs import forms

DEMOCRATS = 'Democrats'
REPUBLICANS = 'Republicans'

def initialize():
    # check initialized
    if Group.objects.filter(name=DEMOCRATS):
        return
    # do initialize
    Group.objects.create(name=DEMOCRATS)
    Group.objects.create(name=REPUBLICANS)
    bodies = [
        'library',
        'potus_desk',
        'senate',
        'house',
        'concomm',
        'graveyard',
    ]
    for body in bodies:
        b = models.LegislativeBody(name=body)
        b.save()

def index(request):
    initialize()
    return render(request, 'index.html')

def echo(request):
    print ('request: ', request)
    print ('user: ', request.user)
    print ('username: ', request.user.username)
    print ('is_authenticated: ', request.user.is_authenticated)

def get_leg_body(chamber):
    chamber = models.LegislativeBody.objects.get(name=chamber).first()
    return chamber

def is_admin(user):
    return False

class Leaders(View):

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


class Character(View):

    def get(self, request, character_id):
        #characters = models.Character.objects.get(player=request.user)
        characters = list(models.Character.objects.all())
        response = serializers.serialize('json', [obj,])
        return HttpResponse(response, content_type='application/json')

    def post(self, request):
        form = forms.CharacterForm(request.POST)
        print request.POST
        return
        if form.is_valid():
            character = models.Character(
                player=request.user,
                primary=form.cleaned_data['primary'],
                name=form.cleaned_data['name'],
                birthday=form.cleaned_data['birthday'],
                residence=form.cleaned_data['residence'],
                party=form.cleaned_data['party'],
                state=form.cleaned_data['state'],
            )
            character.save()
            return HttpResponse(status=201)
        print form.errors


class Characters(View):

    def get(self, request):
        characters = models.Character.objects.all()
        username = request.GET.get('username')
        player = models.User.objects.filter(username=username).first()
        if player:
            characters = characters.filter(player=player)
        characters = list(characters)
        response = serializers.serialize('json', characters)
        return HttpResponse(response, content_type='application/json')


class Bill(View):

    def post(request):
        title = request.POST['title']
        body = request.POST['body']
        sponsor_id = request.POST['sponsor_id']
        sponsor = models.Character.objects.get(id=sponsor_id)
        bill = models.Bill(title=title, body=body, sponsor=sponsor)
        bill.save()
        return HttpResponse(status=201)
