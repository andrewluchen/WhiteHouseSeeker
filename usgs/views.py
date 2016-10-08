import json

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

from usgs import models, utils
from usgs.bill.views import (
    BillView,
    BillVersionView,
    BillsView,
    ClerkView,
    DebatesView,
    NewBillView,
    VoteView,
    VotesView,
)
from usgs.character.views import (
    CharacterView,
    CharacterVotingRecordView,
    CharactersView,
    NewCharacterView,
)

def echo(request):
    print ('request: ', request)
    print ('user: ', request.user)
    print ('username: ', request.user.username)
    print ('is_authenticated: ', request.user.is_authenticated)

class Index(View):

    def get(self, request):
        utils.initialize()
        return render(request, 'index.html')

class UserView(View):

    def get(self, request, pk):
        userobj = User.objects.get(pk=pk)
        characterobjs = models.Character.objects.filter(player=userobj)
        characters =[]
        for c in list(characterobjs):
            characters.append({
                'character_id': c.id,
                'name': c.description,
                'party': c.party,
            })
        user = {
            'username': userobj.username,
            'characters': characters,
        }
        response = json.dumps(user)
        return HttpResponse(response, content_type='application/json')


class CapitolView(View):

    def get(self, request):
        data = [
            ('potus', models.Holding.objects.filter(title=models.Holding.POTUS)),
            ('vpotus', models.Holding.objects.filter(title=models.Holding.VPOTUS)),
            ('senatemajorityleader', models.Holding.objects.filter(title=models.Holding.SML)),
            ('senatemajoritywhip', models.Holding.objects.filter(title=models.Holding.SML2)),
            ('senateminorityleader', models.Holding.objects.filter(title=models.Holding.SML)),
            ('senateminoritywhip', models.Holding.objects.filter(title=models.Holding.SML2)),
            ('speaker', models.Holding.objects.filter(title=models.Holding.SPEAKER)),
            ('housemajorityleader', models.Holding.objects.filter(title=models.Holding.HML)),
            ('housemajoritywhip', models.Holding.objects.filter(title=models.Holding.HML2)),
            ('houseminorityleader', models.Holding.objects.filter(title=models.Holding.HmL)),
            ('houseminoritywhip', models.Holding.objects.filter(title=models.Holding.HmL2)),
            ('dncchair', models.Holding.objects.filter(title=models.Holding.DNC)),
            ('dncchair2', models.Holding.objects.filter(title=models.Holding.DNC2)),
            ('rncchair', models.Holding.objects.filter(title=models.Holding.RNC)),
            ('rncchair2', models.Holding.objects.filter(title=models.Holding.RNC2)),
        ]
        response = {}
        not_applicable = 'N/A'
        for (position, filtered) in data:
            if (filtered.count() != 0):
                response[position] = filtered.first().holder.short_description()
            else:
                response[position] = 'N/A'
        response = json.dumps(response)
        return HttpResponse(response, content_type='application/json')
