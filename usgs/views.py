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

    @user_passes_test(utils.is_admin)
    def put(self, request):
        pass


class Character(View):

    @staticmethod
    def new_character(request):
        form = forms.CharacterForm(request.POST)
        if form.is_valid():
            character = models.Character(
                player=request.user,
                primary=form.cleaned_data['primary'],
                name=form.cleaned_data['name'],
                gender=form.cleaned_data['gender'],
                birthday=form.cleaned_data['birthday'],
                residence=form.cleaned_data['residence'],
                party=form.cleaned_data['party'],
                state=form.cleaned_data['state'],
                avatar=form.cleaned_data['avatar'],
                bio=form.cleaned_data['bio'],
            )
            character.save()
            return HttpResponse(status=201)
        return HttpResponse(form.errors, status=400)

    def get(self, request, pk):
        characterobj = models.Character.objects.get(pk=pk)
        character = model_to_dict(characterobj)
        character['description'] = characterobj.description
        character['birthday'] = str(character['birthday'])
        character['activated'] = str(character['activated'])
        character['deactivated'] = str(character['deactivated'])
        response = json.dumps(character)
        return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        utils.validate_character(request.user, pk)
        if (request.POST.get('change_primary')):
            old = models.Character.objects.get(player=request.user, primary=True)
            new = models.Character.objects.get(player=request.user, pk=pk)
            old.primary = False
            new.primary = True
            old.save()
            new.save()
            return HttpResponse(status=200)
        else:
            character = models.Character.objects.get(pk=pk)
            character.name = request.POST.get('name')
            character.gender = request.POST.get('gender')
            character.birthday = request.POST.get('birthday')
            character.residence = request.POST.get('residence')
            character.party = request.POST.get('party')
            character.state = request.POST.get('state')
            character.avatar = request.POST.get('avatar')
            character.bio = request.POST.get('bio')
            character.save()
            return HttpResponse(status=200)


class Characters(View):

    def get(self, request):
        characterobjs = models.Character.objects.all()
        username = request.GET.get('username')
        player = models.User.objects.get(username=username)
        characterobjs = characterobjs.filter(player=player)
        characters = list(characterobjs.values())
        for i, c in enumerate(characters):
            c['description'] = characterobjs[i].description
            c['birthday'] = str(c['birthday'])
            c['activated'] = str(c['activated'])
            c['deactivated'] = str(c['deactivated'])
        response = json.dumps(characters)
        return HttpResponse(response, content_type='application/json')


class Bill(View):

    @staticmethod
    def new_bill(request):
        title = request.POST.get('title')
        body = request.POST.get('body')
        sponsor_id = request.POST.get('sponsor_id')
        utils.validate_character(request.user, sponsor_id)

        sponsor = models.Character.objects.get(pk=sponsor_id)
        chamber = request.POST.get('chamber')
        bill = models.Bill(title=title, sponsor=sponsor)
        bill.save()
        version = models.BillVersion(
            bill=bill,
            status=models.BILL_CLERK,
            body=body,
            modified=datetime.now(),
            location=utils.get_leg_body(chamber),
        )
        version.save()
        return HttpResponse(status=201)

    def get(self, request, pk):
        billobj = models.Bill.objects.get(id=pk)
        if (request.GET.get('version_id')):
            bill = model_to_dict(models.BillVersion.objects.get(id=request.GET.get('version_id')))
            bill['title'] = billobj.title;
            bill['sponsor'] = {
                'id': billobj.sponsor.id,
                'name': billobj.sponsor.description,
            }
            cosponsors = []
            for cs in billobj.cosponsors.all():
                cosponsors.append({
                    'id': cs.id,
                    'name': cs.description,
                })
            bill['cosponsors'] = cosponsors
            bill['modified'] = str(bill['modified'])
            response = json.dumps(bill)
            return HttpResponse(response, content_type='application/json')
        else :
            bill = model_to_dict(billobj)
            bill['sponsor'] = {
                'id': billobj.sponsor.id,
                'name': billobj.sponsor.description,
            }
            cosponsors = []
            for cs in billobj.cosponsors.all():
                cosponsors.append({
                    'id': cs.id,
                    'name': cs.description,
                })
            bill['cosponsors'] = cosponsors
            response = json.dumps(bill)
            return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        bill = models.BillVersion.objects.get(pk=pk)
        title = request.POST.get('title')
        body = request.POST.get('body')
        bill.title = title
        bill.body = body
        bill.save()
        return HttpResponse(status=201)


class Bills(View):

    def get(self, request):
        billobjs = models.BillVersion.objects.all()
        if (request.GET.get('chamber')):
            chamber = utils.get_leg_body(request.GET.get('chamber'))
            billobjs = billobjs.filter(location=chamber)
        if (request.GET.get('status')):
            billobjs = billobjs.filter(status=request.GET.get('status'))
        bills = list(billobjs.values())
        for i, bill in enumerate(bills):
            bill['title'] = billobjs[i].bill.title
            bill['sponsor'] = billobjs[i].bill.sponsor.__str__()
            bill['modified'] = str(bills[i]['modified'])
        response = json.dumps(bills)
        return HttpResponse(response, content_type='application/json')
