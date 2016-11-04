import json

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

from usgs import models, utils
from usgs.bill.views import (
    BillView,
    BillsView,
    BillVersionView,
    BillVersionsView,
    NewBillView,
)
from usgs.bill_action.views import (
    NewDebateView,
    DebateView,
    DebateMotionView,
    DebateOfficerView,
    DebatesView,
    NewVoteView,
    VoteView,
    VoteOfficerView,
    VotesView,
)
from usgs.character.views import (
    CharacterView,
    CharacterVotingRecordView,
    CharactersView,
    NewCharacterView,
)
from usgs.election.views import (
    WarchestView,
    NewElectionView,
    ElectionView,
    ElectionDayView,
    ElectionsView,
    CampaignView,
    CampaignDayView,
)
from usgs.news.views import (
    NewTweetView,
    TweetView,
    TweetsView,
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
            ('potus', models.Holding.objects.filter(title=models.Holding.POTUS, endtime__isnull=True)),
            ('vpotus', models.Holding.objects.filter(title=models.Holding.VPOTUS, endtime__isnull=True)),
            ('senatemajorityleader', models.Holding.objects.filter(subtitle=models.Holding.SML, endtime__isnull=True)),
            ('senatemajoritywhip', models.Holding.objects.filter(subtitle=models.Holding.SML2, endtime__isnull=True)),
            ('senateminorityleader', models.Holding.objects.filter(subtitle=models.Holding.SML, endtime__isnull=True)),
            ('senateminoritywhip', models.Holding.objects.filter(subtitle=models.Holding.SML2, endtime__isnull=True)),
            ('speaker', models.Holding.objects.filter(subtitle=models.Holding.SPEAKER, endtime__isnull=True)),
            ('housemajorityleader', models.Holding.objects.filter(subtitle=models.Holding.HML, endtime__isnull=True)),
            ('housemajoritywhip', models.Holding.objects.filter(subtitle=models.Holding.HML2, endtime__isnull=True)),
            ('houseminorityleader', models.Holding.objects.filter(subtitle=models.Holding.HmL, endtime__isnull=True)),
            ('houseminoritywhip', models.Holding.objects.filter(subtitle=models.Holding.HmL2, endtime__isnull=True)),
            ('dncchair', models.Holding.objects.filter(partytitle=models.Holding.DNC, endtime__isnull=True)),
            ('dncchair2', models.Holding.objects.filter(partytitle=models.Holding.DNC2, endtime__isnull=True)),
            ('rncchair', models.Holding.objects.filter(partytitle=models.Holding.RNC, endtime__isnull=True)),
            ('rncchair2', models.Holding.objects.filter(partytitle=models.Holding.RNC2, endtime__isnull=True)),
        ]
        response = {}
        not_applicable = 'N/A'
        for (position, filtered) in data:
            if (filtered.count() != 0):
                response[position] = filtered.first().holder.short_description()
            else:
                response[position] = 'N/A'
        response['senators'] = self.get_senators()
        response = json.dumps(response)
        return HttpResponse(response, content_type='application/json')

    def get_senators(self):
        senators = models.Holding.objects.filter(title=models.Holding.SENATOR, endtime__isnull=True)
        response = []
        for s in senators:
            holder = s.holder
            response.append({
                'id': holder.id,
                'name': holder.description,
                'state': holder.state,
                'party': holder.party,
            })
        return response
