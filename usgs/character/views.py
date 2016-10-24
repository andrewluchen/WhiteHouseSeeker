from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from rest_framework.renderers import JSONRenderer

from usgs.utils import validate_character
from usgs.character.forms import CharacterForm
from usgs.character.models import Character, Holding
from usgs.character.serializers import CharacterSerializer
from usgs.election.models import Warchest

class NewCharacterView(View):

    def post(self, request):
        form = CharacterForm(request.POST)
        if form.is_valid():
            character = Character(
                player=request.user,
                activated=timezone.now(),
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
            warchest = Warchest(character=character)
            warchest.save()
            holding = Holding(
                holder=character,
                title=Holding.SENATOR,
                starttime=timezone.now(),
            )
            holding.save()
            return HttpResponse(status=201)
        return HttpResponse(form.errors.as_json(), status=400)


class CharacterView(View):

    def get(self, request, pk):
        character_obj = Character.objects.get(pk=pk)
        character = JSONRenderer().render(CharacterSerializer(character_obj).data)
        return HttpResponse(character, content_type='application/json')

    def post(self, request, pk):
        character = Character.objects.get(pk=pk)
        validate_character(request.user, character)
        if (request.POST.get('make_primary')):
            old = Character.objects.get(player=request.user, primary=True)
            old.primary = False
            character.primary = True
            old.save()
            character.save()
            return HttpResponse(status=200)
        else:
            character = Character.objects.get(pk=pk)
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


class CharacterVotingRecordView(View):

    def get(self, request, pk):
        character = Character.objects.get(pk=pk)
        yeaobjs = character.yea_votes.all()
        nayobjs = character.nay_votes.all()
        presobjs = character.pres_votes.all()
        yeas = []
        nays = []
        pres = []
        for i, v in enumerate(list(yeaobjs)):
            yeas.append({
                'vote_id': v.id,
                'title': yeaobjs[i].subject.description,
                'endtime': str(v.endtime),
            })
        for i, v in enumerate(list(nayobjs)):
            nays.append({
                'vote_id': v.id,
                'title': nayobjs[i].subject.description,
                'endtime': str(v.endtime),
            })
        for i, v in enumerate(list(presobjs)):
            pres.append({
                'vote_id': v.id,
                'title': presobjs[i].subject.description,
                'endtime': str(v.endtime),
            })
        votingrecord = {
            'yeas': yeas,
            'nays': nays,
            'pres': pres,
        }
        response = json.dumps(votingrecord)
        return HttpResponse(response, content_type='application/json')


class CharactersView(View):

    def get(self, request):
        character_objs = Character.objects.all()
        if (request.GET.get('username')):
            player = User.objects.get(username=request.GET.get('username'))
            character_objs = character_objs.filter(player=player)
        characters = JSONRenderer().render(CharacterSerializer(character_objs, many=True).data)
        return HttpResponse(characters, content_type='application/json')
