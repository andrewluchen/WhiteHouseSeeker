from django.http import HttpResponse
from django.shortcuts import render
from django.views import View

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
