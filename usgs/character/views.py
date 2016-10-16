import json

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from usgs.utils import validate_character
from usgs.character.forms import CharacterForm
from usgs.character.models import Character, Holding

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
            holding = Holding(
                holder=character,
                title=Holding.SENATOR,
                starttime=timezone.now(),
            )
            holding.save()
            return HttpResponse(status=201)
        return HttpResponse(form.errors, status=400)


class CharacterView(View):

    def get(self, request, pk):
        characterobj = Character.objects.get(pk=pk)
        character = {
            'username': characterobj.player.username,
            'user_id': characterobj.player.id,
            'description': characterobj.description,
            'name': characterobj.name,
            'title': characterobj.get_title(),
            'birthday': str(characterobj.birthday),
            'gender': characterobj.gender,
            'residence': characterobj.residence,
            'party': characterobj.party,
            'state': characterobj.state,
            'avatar': characterobj.avatar,
            'activated': str(characterobj.activated),
            'deactivated': str(characterobj.deactivated),
        }
        response = json.dumps(character)
        return HttpResponse(response, content_type='application/json')

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
        spobjs = character.sponsored_bills.all()
        csobjs = character.cosponsored_bills.all()
        yeas = []
        nays = []
        pres = []
        sponsored = []
        cosponsored = []
        for v in list(yeaobjs):
            yeas.append({
                'vote_id': v.id,
                'title': v.subject.description,
                'endtime': str(v.endtime),
            })
        for v in list(nayobjs):
            nays.append({
                'vote_id': v.id,
                'title': v.subject.description,
                'endtime': str(v.endtime),
            })
        for v in list(presobjs):
            pres.append({
                'vote_id': v.id,
                'title': v.subject.description,
                'endtime': str(v.endtime),
            })
        for b in list(spobjs):
            sponsored.append({
                'bill_id': b.id,
                'title': b.title,
            })
        for b in list(csobjs):
            cosponsored.append({
                'bill_id': b.id,
                'title': b.title,
            })
        votingrecord = {
            'yeas': yeas,
            'nays': nays,
            'pres': pres,
            'sponsored': sponsored,
            'cosponsored': cosponsored,
        }
        response = json.dumps(votingrecord)
        return HttpResponse(response, content_type='application/json')


class CharactersView(View):

    def get(self, request):
        characterobjs = Character.objects.all()
        if (request.GET.get('username')):
            player = User.objects.get(username=request.GET.get('username'))
            characterobjs = characterobjs.filter(player=player)
        characters = []
        for i, c in enumerate(list(characterobjs)):
            characters.append({
                'id': c.id,
                'username': c.player.username,
                'user_id': c.player.id,
                'description': c.description,
                'primary': c.primary,
                'name': c.name,
                'title': c.get_title(),
                'birthday': str(c.birthday),
                'gender': c.gender,
                'residence': c.residence,
                'party': c.party,
                'state': c.state,
                'avatar': c.avatar,
                'activated': str(c.activated),
                'deactivated': str(c.deactivated),
            })
        response = json.dumps(characters)
        return HttpResponse(response, content_type='application/json')
