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

class Leaders(View):

    def get(self, request):
        obj = models.Leadership.objects.all().first()
        if (obj == None):
            obj = models.Leadership()
            obj.save()
        response = serializers.serialize('json', [obj,])
        return HttpResponse(response, content_type='application/json')
