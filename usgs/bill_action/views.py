import json

from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import View

from usgs.bill.models import Bill, BillVersion
from usgs.bill_action.models import Debate, Vote
from usgs.character.models import Character

from usgs.utils import get_legislative_body, validate_character


class NewVoteView(View):

    def post(self, request):
        version_id = request.POST.get('version_id')
        chamber = request.POST.get('chamber')
        hours = request.POST.get('hours')
        billversion = BillVersion.objects.get(id=version_id)
        billversion.modified = timezone.now()
        billversion.closed = True
        billversion.save()
        newbillversion = BillVersion(
            bill=billversion.bill,
            status=BillVersion.BILL_VOTE,
            body=billversion.body,
            modified=timezone.now(),
            location=get_legislative_body(chamber),
        )
        newbillversion.save()
        vote = Vote(
            subject=newbillversion,
            starttime=timezone.now(),
            endtime=timezone.now() + timezone.timedelta(hours=int(hours)),
            location=get_legislative_body(chamber),
        )
        vote.save()
        return HttpResponse(status=200)


class VoteView(View):

    def get(self, request, pk):
        voteobj = Vote.objects.get(id=pk)
        yeas = []
        for i, c in enumerate(voteobj.yeas.all()):
            yeas.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        nays = []
        for i, c in enumerate(voteobj.nays.all()):
            nays.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        pres = []
        for i, c in enumerate(voteobj.pres.all()):
            pres.append({
                'id': c.id,
                'name': c.description,
                'party': c.party,
            })
        vote = {
            'yeas': yeas,
            'nays': nays,
            'pres': pres,
            'title': voteobj.subject.bill.description,
            'body': voteobj.subject.body,
            'location': voteobj.subject.location.name,
            'starttime': str(voteobj.starttime),
            'starttime': str(voteobj.starttime),
        }
        response = json.dumps(vote)
        return HttpResponse(response, content_type='application/json')

    def post(self, request, pk):
        voteobj = Vote.objects.get(id=pk)
        castvote = request.POST.get('vote')
        character_id = request.POST.get('character_id')
        character = Character.objects.get(id=character_id)
        validate_character(request.user, character)

        if (castvote == 'yea'):
            voteobj.yeas.add(character)
            voteobj.nays.remove(character)
            voteobj.pres.remove(character)
        if (castvote == 'nay'):
            voteobj.yeas.remove(character)
            voteobj.nays.add(character)
            voteobj.pres.remove(character)
        if (castvote == 'present'):
            voteobj.yeas.remove(character)
            voteobj.nays.remove(character)
            voteobj.pres.add(character)
        return HttpResponse(status=200)


class VotesView(View):

    def get(self, request):
        voteobjs = Vote.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            voteobjs = voteobjs.filter(location=chamber)
        if (request.GET.get('active')):
            voteobjs = voteobjs.filter(endtime__gt=now)
        votes = list(voteobjs.values())
        for i, vote in enumerate(votes):
            vote['title'] = voteobjs[i].subject.bill.description
            vote['yeas'] = voteobjs[i].yeas.count()
            vote['nays'] = voteobjs[i].nays.count()
            vote['pres'] = voteobjs[i].pres.count()
            vote['starttime'] = str(vote['starttime'])
            vote['endtime'] = str(vote['endtime'])
        response = json.dumps(votes)
        return HttpResponse(response, content_type='application/json')


class NewDebateView(View):

    def post(self, request):
        version_id = request.POST.get('version_id')
        chamber = request.POST.get('chamber')
        hours = request.POST.get('hours')
        billversion = BillVersion.objects.get(id=version_id)
        billversion.modified = timezone.now()
        billversion.closed = True
        billversion.save()
        newbillversion = BillVersion(
            bill=billversion.bill,
            status=BillVersion.BILL_DEBATE,
            body=billversion.body,
            modified=timezone.now(),
            location=get_legislative_body(chamber),
        )
        newbillversion.save()
        debate = Debate(
            subject=newbillversion,
            starttime=timezone.now(),
            endtime=timezone.now() + timezone.timedelta(hours=int(hours)),
            location=get_legislative_body(chamber),
        )
        debate.save()
        return HttpResponse(status=200)


class DebatesView(View):

    def get(self, request):
        debateobjs = Debate.objects.all()
        now = timezone.now()
        if (request.GET.get('chamber')):
            chamber = get_legislative_body(request.GET.get('chamber'))
            debateobjs = debateobjs.filter(location=chamber)
        if (request.GET.get('active')):
            debateobjs = debateobjs.filter(endtime__gt=now)
        debates = list(debateobjs.values())
        for i, debate in enumerate(debates):
            debate['title'] = debateobjs[i].subject.bill.description
            debate['starttime'] = str(debate['starttime'])
            debate['endtime'] = str(debate['endtime'])
        response = json.dumps(debates)
        return HttpResponse(response, content_type='application/json')
